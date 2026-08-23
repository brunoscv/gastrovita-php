<?php

namespace App\Support;

use App\Models\YoutubeAccount;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use RuntimeException;

/**
 * Equivalente a lib/googleYoutube.ts, mas sem o SDK pesado google/apiclient
 * (que puxa ~200MB de definições de todas as APIs do Google). Fala direto
 * com os endpoints REST do OAuth2 e do YouTube Data API v3 via Guzzle.
 */
class YoutubeClient
{
    private const SCOPES = [
        'https://www.googleapis.com/auth/youtube.upload',
        'https://www.googleapis.com/auth/youtube.readonly',
    ];

    private Client $http;

    public function __construct()
    {
        $this->http = new Client(['timeout' => 30]);
    }

    public function buildConsentUrl(): string
    {
        $params = [
            'client_id' => env('YOUTUBE_CLIENT_ID'),
            'redirect_uri' => env('YOUTUBE_REDIRECT_URI'),
            'response_type' => 'code',
            'access_type' => 'offline',
            'prompt' => 'consent',
            'scope' => implode(' ', self::SCOPES),
        ];

        return 'https://accounts.google.com/o/oauth2/v2/auth?'.http_build_query($params);
    }

    /**
     * @return array{channelTitle: string|null}
     */
    public function exchangeCodeAndStoreAccount(string $code): array
    {
        $tokenResponse = $this->http->post('https://oauth2.googleapis.com/token', [
            'form_params' => [
                'code' => $code,
                'client_id' => env('YOUTUBE_CLIENT_ID'),
                'client_secret' => env('YOUTUBE_CLIENT_SECRET'),
                'redirect_uri' => env('YOUTUBE_REDIRECT_URI'),
                'grant_type' => 'authorization_code',
            ],
        ]);
        $tokens = json_decode((string) $tokenResponse->getBody(), true);

        if (empty($tokens['refresh_token'])) {
            throw new RuntimeException(
                'O Google não retornou um refresh token. Revogue o acesso em myaccount.google.com/permissions e tente conectar de novo.'
            );
        }

        $channelResponse = $this->http->get('https://www.googleapis.com/youtube/v3/channels', [
            'query' => ['part' => 'snippet', 'mine' => 'true'],
            'headers' => ['Authorization' => 'Bearer '.$tokens['access_token']],
        ]);
        $channels = json_decode((string) $channelResponse->getBody(), true);
        $channel = $channels['items'][0] ?? null;

        if (! $channel || empty($channel['id'])) {
            throw new RuntimeException('Não foi possível encontrar um canal do YouTube para essa conta Google.');
        }

        YoutubeAccount::query()->delete();
        YoutubeAccount::create([
            'channelId' => $channel['id'],
            'channelTitle' => $channel['snippet']['title'] ?? null,
            'refreshToken' => $tokens['refresh_token'],
        ]);

        return ['channelTitle' => $channel['snippet']['title'] ?? $channel['id']];
    }

    /**
     * @return array{connected: bool, channelTitle?: string|null, connectedAt?: string}
     */
    public function getStatus(): array
    {
        $account = YoutubeAccount::query()->first();

        if (! $account) {
            return ['connected' => false];
        }

        return [
            'connected' => true,
            'channelTitle' => $account->channelTitle,
            'connectedAt' => optional($account->connectedAt)->toJSON() ?? $account->connectedAt,
        ];
    }

    private function getAccessToken(): string
    {
        $account = YoutubeAccount::query()->first();

        if (! $account) {
            throw new RuntimeException('Nenhuma conta do YouTube conectada. Conecte em Vídeos > Conectar com YouTube.');
        }

        $response = $this->http->post('https://oauth2.googleapis.com/token', [
            'form_params' => [
                'refresh_token' => $account->refreshToken,
                'client_id' => env('YOUTUBE_CLIENT_ID'),
                'client_secret' => env('YOUTUBE_CLIENT_SECRET'),
                'grant_type' => 'refresh_token',
            ],
        ]);

        $data = json_decode((string) $response->getBody(), true);

        return $data['access_token'];
    }

    /**
     * Abre uma sessão de upload resumível do YouTube e devolve a URL assinada
     * dessa sessão — o navegador do admin envia o arquivo direto pra essa URL,
     * sem o arquivo passar pelo servidor PHP (necessário em hospedagem
     * compartilhada, que não suporta upload/execução de vídeos grandes).
     */
    public function initResumableUpload(string $title, bool $published): string
    {
        $accessToken = $this->getAccessToken();

        try {
            $response = $this->http->post('https://www.googleapis.com/upload/youtube/v3/videos', [
                'query' => ['uploadType' => 'resumable', 'part' => 'snippet,status'],
                'headers' => [
                    'Authorization' => 'Bearer '.$accessToken,
                    'Content-Type' => 'application/json; charset=UTF-8',
                ],
                'json' => [
                    'snippet' => ['title' => $title, 'description' => ''],
                    'status' => ['privacyStatus' => $published ? 'public' : 'unlisted'],
                ],
            ]);
        } catch (GuzzleException $e) {
            throw new RuntimeException('Falha ao iniciar upload pro YouTube: '.$e->getMessage());
        }

        $uploadUrl = $response->getHeaderLine('Location');

        if (! $uploadUrl) {
            throw new RuntimeException('YouTube não retornou a URL de upload.');
        }

        return $uploadUrl;
    }
}
