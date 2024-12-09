// utils/securityPatterns.ts
import { NextRequest } from 'next/server';

interface SecurityViolation {
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    details: any;
    timestamp: string;
}

export class SecurityPatterns {
    // SQL Injection Detection Patterns
    private static sqlInjectionPatterns = [
        /('|"|;|--|\/\*|\*\/|@@|@|\bOR\b|\bAND\b|\bUNION\b|\bSELECT\b|\bDROP\b|\bDELETE\b|\bUPDATE\b)/i,
        /(\bEXEC\b|\bALTER\b|\bINSERT\b|\bCREATE\b|\bDROP\b|\bTRUNCATE\b|\bSCHEMA\b|\bGRANT\b|\bREVOKE\b|\bROLLBACK\b)/i,
        /((\%27)|(\')|(--)|(\%23)|(#))/i,
        /((\%27)|(\')|(--)|(\%3B)|(;))/i,
        /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
        /exec(\s|\+)+(s|x)p\w+/i
    ];

    // XSS Attack Detection Patterns
    private static xssPatterns = [
        /((\%3C)|<)((\%2F)|\/)*[a-z0-9\%]+((\%3E)|>)/i,
        /((\%3C)|<)((\%69)|i|(\%49))((\%6D)|m|(\%4D))((\%67)|g|(\%47))[^\n]+((\%3E)|>)/i,
        /((\%3C)|<)[^\n]+((\%3E)|>)/i,
        /((javascript|vbscript|expression|applet|meta|xml|blink|link|style|script|embed|object|iframe|frame|frameset|ilayer|layer|bgsound|title|base|onabort|onactivate|onafterprint|onafterupdate|onbeforeactivate|onbeforecopy|onbeforecut|onbeforedeactivate|onbeforeeditfocus|onbeforepaste|onbeforeprint|onbeforeunload|onbeforeupdate|onblur|onbounce|oncellchange|onchange|onclick|oncontextmenu|oncontrolselect|oncopy|oncut|ondataavailable|ondatasetchanged|ondatasetcomplete|ondblclick|ondeactivate|ondrag|ondragend|ondragenter|ondragleave|ondragover|ondragstart|ondrop|onerror|onerrorupdate|onfilterchange|onfinish|onfocus|onfocusin|onfocusout|onhelp|onkeydown|onkeypress|onkeyup|onlayoutcomplete|onload|onlosecapture|onmousedown|onmouseenter|onmouseleave|onmousemove|onmouseout|onmouseover|onmouseup|onmousewheel|onmove|onmoveend|onmovestart|onpaste|onpropertychange|onreadystatechange|onreset|onresize|onresizeend|onresizestart|onrowenter|onrowexit|onrowsdelete|onrowsinserted|onscroll|onselect|onselectionchange|onselectstart|onstart|onstop|onsubmit|onunload):)/i
    ];

    // Directory Traversal Patterns
    private static directoryTraversalPatterns = [
        /(\.\.\/|\.\.\\|%2e%2e%2f|%252e%252e%252f)/i,
        /(\.(\/|\%2f)|\.\.|(\/|\%2f)\.(\/|\%2f))/i
    ];

    // Command Injection Patterns
    private static commandInjectionPatterns = [
        /(\||;|&|`|>|<|\$\(|\${)/i,
        /(system\(|exec\(|passthru\(|eval\(|shell_exec\()/i
    ];

    // File Upload Attack Patterns
    private static fileUploadPatterns = {
        dangerousExtensions: /\.(php|phtml|php3|php4|php5|php7|pht|phar|exe|jsp|asp|aspx|cgi|pl|py|sh|bash|rb)$/i,
        mimeTypes: /^(text\/php|application\/x-httpd-php|application\/x-php|application\/php|application\/x-perl|application\/x-python|application\/x-bash)$/i,
        nullBytes: /\x00/,
        doubleExtension: /\.(jpg|jpeg|png|gif)\.(php|phtml|php3|php4|php5|php7|pht|phar)$/i
    };

    // Check for SQL Injection attempts
    static checkSQLInjection(input: string): boolean {
        return this.sqlInjectionPatterns.some(pattern => pattern.test(input));
    }

    // Check for XSS attempts
    static checkXSS(input: string): boolean {
        return this.xssPatterns.some(pattern => pattern.test(input));
    }

    // Check for Directory Traversal attempts
    static checkDirectoryTraversal(input: string): boolean {
        return this.directoryTraversalPatterns.some(pattern => pattern.test(input));
    }

    // Check for Command Injection attempts
    static checkCommandInjection(input: string): boolean {
        return this.commandInjectionPatterns.some(pattern => pattern.test(input));
    }

    // Validate file uploads
    static validateFileUpload(filename: string, mimeType: string): boolean {
        return !(
            this.fileUploadPatterns.dangerousExtensions.test(filename) ||
            this.fileUploadPatterns.mimeTypes.test(mimeType) ||
            this.fileUploadPatterns.nullBytes.test(filename) ||
            this.fileUploadPatterns.doubleExtension.test(filename)
        );
    }

    // Request sanitization
    static sanitizeRequest(req: NextRequest): SecurityViolation[] {
        const violations: SecurityViolation[] = [];
        const timestamp = new Date().toISOString();

        // Check query parameters
        const queryParams = Object.fromEntries(req.nextUrl.searchParams);
        Object.entries(queryParams).forEach(([key, value]) => {
            if (this.checkSQLInjection(value)) {
                violations.push({
                    type: 'SQL_INJECTION',
                    severity: 'critical',
                    details: { param: key, value },
                    timestamp
                });
            }
            if (this.checkXSS(value)) {
                violations.push({
                    type: 'XSS',
                    severity: 'high',
                    details: { param: key, value },
                    timestamp
                });
            }
        });

        // Check headers for suspicious patterns
        const suspiciousHeaders = [
            'x-forwarded-for',
            'x-real-ip',
            'referer',
            'user-agent'
        ];

        suspiciousHeaders.forEach(header => {
            const value = req.headers.get(header);
            if (value && (this.checkXSS(value) || this.checkCommandInjection(value))) {
                violations.push({
                    type: 'HEADER_INJECTION',
                    severity: 'high',
                    details: { header, value },
                    timestamp
                });
            }
        });

        // Check path for directory traversal
        if (this.checkDirectoryTraversal(req.nextUrl.pathname)) {
            violations.push({
                type: 'DIRECTORY_TRAVERSAL',
                severity: 'critical',
                details: { path: req.nextUrl.pathname },
                timestamp
            });
        }

        return violations;
    }
}