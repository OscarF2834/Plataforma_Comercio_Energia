<?php

namespace App\Patterns;

class LoggerService
{
    private static ?LoggerService $instance = null;

    private array $logs = [];
    private int $transactionCount = 0;
    private int $offerCount = 0;

    private string $dataFile;

    private function __construct()
    {
        $this->dataFile = storage_path('app/logger_data.json');
        $this->load();
    }

    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function load(): void
    {
        if (file_exists($this->dataFile)) {
            $data = json_decode(file_get_contents($this->dataFile), true);
            $this->logs = $data['logs'] ?? [];
            $this->transactionCount = $data['transactionCount'] ?? 0;
            $this->offerCount = $data['offerCount'] ?? 0;
        }
    }

    private function save(): void
    {
        $data = [
            'logs' => $this->logs,
            'transactionCount' => $this->transactionCount,
            'offerCount' => $this->offerCount,
        ];
        file_put_contents($this->dataFile, json_encode($data, JSON_PRETTY_PRINT));
    }

    public function log(string $message): void
    {
        $this->logs[] = '[' . date('Y-m-d H:i:s') . '] ' . $message;
        $this->save();
    }

    public function incrementTransactions(): void
    {
        $this->transactionCount++;
        $this->save();
    }

    public function incrementOffers(): void
    {
        $this->offerCount++;
        $this->save();
    }

    public function getMetrics(): array
    {
        return [
            'totalLogs' => count($this->logs),
            'transactionCount' => $this->transactionCount,
            'offerCount' => $this->offerCount,
            'recentLogs' => array_slice($this->logs, -5),
        ];
    }
}
