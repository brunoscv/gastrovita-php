<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use PDO;

/**
 * Ferramenta de uso único: importa os dados do Postgres do projeto Node
 * (que já tem conteúdo editado pelo painel, além do que veio do seed original)
 * pro MySQL novo. Não faz parte do runtime da API — só roda localmente, uma
 * vez, antes do deploy.
 *
 * Os nomes de coluna são idênticos entre os dois bancos de propósito (mesmo
 * camelCase do schema Prisma original), então a cópia é campo a campo sem
 * transformação. Os ids (cuid do Prisma) são preservados como estão — cabem
 * tranquilamente numa coluna CHAR(36).
 *
 * Uso:
 *   php artisan migrate:from-postgres --from="postgresql://gastrovita:gastrovita@127.0.0.1:5433/gastrovita"
 */
class MigrateFromPostgres extends Command
{
    protected $signature = 'migrate:from-postgres {--from= : DSN do Postgres de origem, ex: postgresql://user:pass@host:port/db} {--dry-run : Só mostra o que seria importado, sem gravar}';

    protected $description = 'Importa os dados do Postgres da API Node pro MySQL novo (ferramenta de uso único)';

    /**
     * Tabela Postgres (nome exato gerado pelo Prisma) => tabela MySQL de destino.
     */
    private const TABLE_MAP = [
        'AdminUser' => 'admin_users',
        'Doctor' => 'doctors',
        'Video' => 'videos',
        'Testimonial' => 'testimonials',
        'Faq' => 'faqs',
        'Insurance' => 'insurances',
        'Exam' => 'exams',
        'ContactInfo' => 'contact_infos',
        'YoutubeAccount' => 'youtube_accounts',
        'ContactSubmission' => 'contact_submissions',
    ];

    public function handle(): int
    {
        $dsn = $this->option('from');
        if (! $dsn) {
            $this->error('Informe --from com a connection string do Postgres de origem.');

            return 1;
        }

        $dryRun = (bool) $this->option('dry-run');
        $pdo = $this->connectPostgres($dsn);

        foreach (self::TABLE_MAP as $pgTable => $mysqlTable) {
            $rows = $pdo->query('SELECT * FROM "'.$pgTable.'"')->fetchAll(PDO::FETCH_ASSOC);
            $rows = array_map([$this, 'normalizeRow'], $rows);

            $this->info(sprintf('%s -> %s: %d linha(s)', $pgTable, $mysqlTable, count($rows)));

            if ($dryRun || empty($rows)) {
                continue;
            }

            DB::connection('mysql')->table($mysqlTable)->truncate();
            foreach (array_chunk($rows, 200) as $chunk) {
                DB::connection('mysql')->table($mysqlTable)->insert($chunk);
            }
        }

        $this->info($dryRun ? 'Dry-run concluído — nada foi gravado no MySQL.' : 'Importação concluída.');

        return 0;
    }

    private function connectPostgres(string $dsn): PDO
    {
        $parts = parse_url($dsn);
        $pgDsn = sprintf(
            'pgsql:host=%s;port=%s;dbname=%s',
            $parts['host'],
            $parts['port'] ?? 5432,
            ltrim($parts['path'] ?? '', '/')
        );

        return new PDO($pgDsn, $parts['user'] ?? null, $parts['pass'] ?? null);
    }

    /**
     * PDO_PGSQL devolve boolean como 't'/'f' — MySQL espera 1/0.
     */
    private function normalizeRow(array $row): array
    {
        foreach ($row as $key => $value) {
            if ($value === 't') {
                $row[$key] = 1;
            } elseif ($value === 'f') {
                $row[$key] = 0;
            }
        }

        return $row;
    }
}
