<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>{{ $subject ?? 'WoofCircle Notification' }}</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f5f2eb;
            color: #262626;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            line-height: 1.6;
        }
        table {
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        img {
            border: 0;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
        }
        .wrapper {
            width: 100%;
            background-color: #f5f2eb;
            padding: 40px 15px;
            box-sizing: border-box;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 14px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
            border: 1px solid #e7e1d5;
        }
        .header {
            background: linear-gradient(180deg, #181818 0%, #111111 100%);
            background-color: #141414;
            padding: 32px 30px 26px 30px;
            text-align: center;
            border-bottom: 3px solid #c4a163;
        }
        .header-logo {
            display: inline-block;
            max-width: 220px;
            max-height: 50px;
            height: auto;
            width: auto;
        }
        .header-tagline {
            margin: 8px 0 0 0;
            color: #c4a163;
            font-size: 11px;
            letter-spacing: 2px;
            text-transform: uppercase;
            font-weight: 600;
        }
        .content {
            padding: 38px 36px 32px 36px;
            color: #2b2b2b;
            font-size: 15px;
        }
        .content h2 {
            color: #141414;
            font-size: 20px;
            font-weight: 700;
            margin-top: 0;
            margin-bottom: 18px;
            letter-spacing: -0.3px;
        }
        .content p {
            margin: 0 0 16px 0;
            line-height: 1.65;
            color: #383838;
        }
        .info-box {
            background-color: #faf8f5;
            border: 1px solid #eee8dc;
            border-left: 4px solid #c4a163;
            padding: 18px 22px;
            margin: 22px 0;
            border-radius: 6px;
        }
        .info-box p {
            margin: 6px 0;
            font-size: 14px;
            color: #262626;
        }
        .info-box p strong {
            color: #141414;
            font-weight: 600;
            min-width: 140px;
            display: inline-block;
        }
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #c4a163 0%, #b38e4f 100%);
            background-color: #c4a163;
            color: #141414 !important;
            text-decoration: none;
            padding: 13px 32px;
            font-weight: 700;
            font-size: 13px;
            border-radius: 30px;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            margin: 22px 0 10px 0;
            box-shadow: 0 4px 12px rgba(196, 161, 99, 0.25);
            text-align: center;
        }
        .btn:hover {
            background-color: #b38e4f;
        }
        .btn-center {
            text-align: center;
            margin: 25px 0 15px 0;
        }
        .footer {
            background-color: #faf8f5;
            padding: 26px 30px;
            text-align: center;
            font-size: 12px;
            color: #707070;
            border-top: 1px solid #eee8dc;
        }
        .footer-nav {
            margin-bottom: 14px;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .footer-nav a {
            color: #8c734b;
            text-decoration: none;
            margin: 0 8px;
            font-weight: 600;
        }
        .footer a {
            color: #c4a163;
            text-decoration: none;
        }
        .footer p {
            margin: 4px 0;
        }
        @media only screen and (max-width: 600px) {
            .wrapper {
                padding: 15px 8px !important;
            }
            .content {
                padding: 26px 20px !important;
            }
            .header {
                padding: 24px 15px !important;
            }
            .info-box {
                padding: 14px 16px !important;
            }
            .info-box p strong {
                display: block !important;
                margin-bottom: 2px !important;
            }
            .btn {
                display: block !important;
                width: 100% !important;
                box-sizing: border-box !important;
            }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <!-- Master Brand Header -->
            <div class="header">
                <a href="{{ config('app.url', 'https://woofcircle.in') }}" target="_blank" style="text-decoration: none; display: inline-block;">
                    <img src="{{ rtrim(config('app.url', 'https://woofcircle.in'), '/') }}/images/logo-full.png" 
                         alt="WoofCircle" 
                         class="header-logo"
                         style="max-width: 220px; max-height: 50px; border: 0; outline: none; vertical-align: middle;">
                </a>
                <div class="header-tagline">India's Premier Canine Sanctuary</div>
            </div>

            <!-- Dynamic Content -->
            <div class="content">
                @yield('content')
            </div>

            <!-- Master Brand Footer -->
            <div class="footer">
                <div class="footer-nav">
                    <a href="{{ route('marketplace.index') }}">Marketplace</a> &bull;
                    <a href="{{ route('directory.index') }}">Directory</a> &bull;
                    <a href="{{ route('community.events.index') }}">Events</a> &bull;
                    <a href="{{ route('help-center') }}">Help Desk</a>
                </div>
                <p>Questions? Contact our concierge at <a href="mailto:hello@woofcircle.in">hello@woofcircle.in</a> or <a href="mailto:support@woofcircle.in">support@woofcircle.in</a></p>
                <p style="color: #999999; font-size: 11px; margin-top: 10px;">&copy; {{ date('Y') }} WoofCircle Sanctuary. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
