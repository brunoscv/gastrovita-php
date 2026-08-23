<?php

namespace App\Support;

class YoutubeIdExtractor
{
    private const ID_RE = '/^[a-zA-Z0-9_-]{11}$/';

    public static function extract(string $input): ?string
    {
        $value = trim($input);

        if (preg_match(self::ID_RE, $value)) {
            return $value;
        }

        $parts = parse_url($value);
        if ($parts === false || ! isset($parts['host'])) {
            return null;
        }

        $host = preg_replace('/^www\./', '', $parts['host']);
        $path = $parts['path'] ?? '';
        $pathSegments = array_values(array_filter(explode('/', $path), fn ($s) => $s !== ''));

        if ($host === 'youtu.be') {
            $id = $pathSegments[0] ?? null;
            return $id && preg_match(self::ID_RE, $id) ? $id : null;
        }

        if ($host === 'youtube.com' || $host === 'm.youtube.com') {
            if ($path === '/watch') {
                parse_str($parts['query'] ?? '', $query);
                $id = $query['v'] ?? null;
                return $id && preg_match(self::ID_RE, $id) ? $id : null;
            }

            if (($pathSegments[0] ?? null) === 'shorts' || ($pathSegments[0] ?? null) === 'embed') {
                $id = $pathSegments[1] ?? null;
                return $id && preg_match(self::ID_RE, $id) ? $id : null;
            }
        }

        return null;
    }
}
