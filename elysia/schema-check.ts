import { Value } from '@sinclair/typebox/value'
import { inputBindingSchema } from './schema';

export const body = {
  "Data": {
    "req": {
      "Url": "http://localhost:7071/api/use/test",
      "Method": "GET",
      "Query": {},
      "Headers": {
        "Accept": [
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8"
        ],
        "Connection": [
          "keep-alive"
        ],
        "Host": [
          "localhost:7071"
        ],
        "User-Agent": [
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
        ],
        "Accept-Encoding": [
          "gzip, deflate, br, zstd"
        ],
        "Accept-Language": [
          "en-GB,en"
        ],
        "Cache-Control": [
          "max-age=0"
        ],
        "Upgrade-Insecure-Requests": [
          "1"
        ],
        "sec-ch-ua": [
          "\"Brave\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\""
        ],
        "sec-ch-ua-mobile": [
          "?0"
        ],
        "sec-ch-ua-platform": [
          "\"Linux\""
        ],
        "Sec-GPC": [
          "1"
        ],
        "Sec-Fetch-Site": [
          "none"
        ],
        "Sec-Fetch-Mode": [
          "navigate"
        ],
        "Sec-Fetch-User": [
          "?1"
        ],
        "Sec-Fetch-Dest": [
          "document"
        ]
      },
      "Params": {
        "name": "test"
      },
      "Identities": [
        {
          "AuthenticationType": null,
          "IsAuthenticated": false,
          "Actor": null,
          "BootstrapContext": null,
          "Claims": [],
          "Label": null,
          "Name": null,
          "NameClaimType": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
          "RoleClaimType": "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        }
      ]
    }
  },
  "Metadata": {
    "name": "\"test\"",
    "Query": {},
    "Headers": {
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "Connection": "keep-alive",
      "Host": "localhost:7071",
      "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      "Accept-Language": "en-GB,en",
      "Cache-Control": "max-age=0",
      "Upgrade-Insecure-Requests": "1",
      "sec-ch-ua": "\"Brave\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Linux\"",
      "Sec-GPC": "1",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-User": "?1",
      "Sec-Fetch-Dest": "document"
    },
    "sys": {
      "MethodName": "use",
      "UtcNow": "2025-01-03T05:37:23.9299023Z",
      "RandGuid": "eac00178-9aae-4a67-adc8-90596a9adc70"
    }
  }
}


if (!Value.Check(inputBindingSchema, body)) {
  const iterator = Value.Errors(inputBindingSchema, body);
  const errors = [...iterator];
  console.error("Invalid body or schema:", errors[0]);
} else {
  console.log("Valid body & schema");
}
