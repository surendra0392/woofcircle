<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $subject ?? 'WoofCircle Notification' }}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f7f5f0;
            color: #212121;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: none;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            border: 1px solid #ede8dd;
        }
        .header {
            background-color: #1a1a1a;
            padding: 28px 30px;
            text-align: center;
            border-bottom: 3px solid #c4a163;
        }
        .header h1 {
            margin: 0;
            color: #c4a163;
            font-size: 22px;
            text-transform: uppercase;
            letter-spacing: 3px;
            font-weight: 800;
        }
        .header p {
            margin: 5px 0 0 0;
            color: #a0a0a0;
            font-size: 11px;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        .content {
            padding: 35px 30px;
        }
        .content h2 {
            color: #1a1a1a;
            font-size: 18px;
            margin-top: 0;
            margin-bottom: 15px;
            font-weight: 700;
        }
        .info-box {
            background-color: #faf8f5;
            border-left: 4px solid #c4a163;
            padding: 16px 20px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .info-box p {
            margin: 6px 0;
            font-size: 14px;
        }
        .btn {
            display: inline-block;
            background-color: #c4a163;
            color: #1a1a1a !important;
            text-decoration: none;
            padding: 12px 28px;
            font-weight: 700;
            font-size: 13px;
            border-radius: 30px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 20px;
        }
        .footer {
            background-color: #faf8f5;
            padding: 24px 30px;
            text-align: center;
            font-size: 12px;
            color: #777777;
            border-top: 1px solid #ede8dd;
        }
        .footer a {
            color: #c4a163;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>WoofCircle</h1>
            <p>India's Premier Canine Sanctuary</p>
        </div>

        <div class="content">
            @yield('content')
        </div>

        <div class="footer">
            <p style="margin: 0 0 8px 0;">Need assistance? Reach us at <a href="mailto:hello@woofcircle.in">hello@woofcircle.in</a> or <a href="mailto:support@woofcircle.in">support@woofcircle.in</a></p>
            <p style="margin: 0;">&copy; {{ date('Y') }} WoofCircle. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
