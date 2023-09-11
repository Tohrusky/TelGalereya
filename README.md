# tgimg-worker

`tgimg-worker` is a Cloudflare Workers service for image hosting. It uses Telegraph's file API and provides a simple Reverse Proxy for it. To use `tgimg-worker`, deploy it to Cloudflare Workers using the provided deployment button. Then use `Custom Domains` to bind your own domain name.

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/YOURUSERNAME/YOURREPO)

## API Endpoint `/api/v1`

### `/upload` - Upload an Image

#### Request

- Method: POST
- Content-Type: multipart/form-data
- Parameters:
  - `file` (single file) - The image file to upload.

#### Response

The response is in protobuf3 format and has the following structure:

```protobuf
message UploadResponse {
  string status = 1;
  string message = 2;
  ImageResponse data = 3;
}

message ImageResponse {
  string origin_img = 1;
  string img = 2;
}
```

- `status` (string): The status of the upload operation. Possible values are "success" or "error".
- `message` (string): A message providing information about the upload operation.
- `data` (ImageResponse): An optional field containing the uploaded image URLs.

#### Example Response (Success):

```json
{
  "status": "success",
  "message": "Upload success!",
  "data": {
    "origin_img": "https://telegra.ph/file/a5418e5f4313b65fba5b8.png",
    "img": "https://xx.114514.org/image/YTU0MThlNWY0MzEzYjY1ZmJhNWI4LnBuZw=="
  }
}
```

### `/nsfw-check` - Check if an Image is NSFW

#### Request

- Method: GET
- Query Parameters:
  - `url` (string) - The image URL to check.

#### Response

The response is in protobuf3 format and has the following structure:

```protobuf
message NSFWCheckResponse {
    string status = 1;
    string message = 2;
    string url = 3;
    bool nsfw = 4;
    NSFWScore score = 5;
}

message NSFWScore {
    double drawing = 1;
    double hentai = 2;
    double neutral = 3;
    double sexy = 4;
    double porn = 5;
}
```

- `status` (string): The status of the check operation. Possible values are "success" or "error".
- `message` (string): A message providing information about the check operation.
- `nsfw` (bool): Whether the image is NSFW. When the value is `true`, the image is NSFW.

#### Example Response (Success):

```json

```

## License

This project is licensed under the BSD 3-Clause - see the LICENSE file for details.
