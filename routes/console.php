<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('woof:send-vaccination-reminders')->dailyAt('09:00');
Schedule::command('tickets:notify-stalled')->dailyAt('08:00');
