# iEnroll API Documentation

## File Management

The following endpoints allow for the management of files, including uploading, retrieving, metadata fetching, and deletion.

### Upload a File

**Endpoint:**

```txt
POST /api/file/upload
```

#### Query Parameters

- ocr_enabled (`optional`): A boolean query parameter to enable Optical Character Recognition (OCR) processing. Defaults to false.

- blurry_enabled (`optional`): A boolean query parameter to enable blurry image detection. Defaults to false.

**Example:**

```txt
/api/file/upload?ocr_enabled=true&blurry_enabled=true
```

#### Request Body

- file (`required`): The file to upload (must be sent as a multipart/form-data).

#### Headers

- Authorization: `Bearer <token>` (JWT token for authentication).

#### Success Response `POST /api/file/upload`

```json
{
  "success": true,
  "document": {
    "id": 1,
    "name": "example-file.pdf",
    "url": "/api/file/123e4567-e89b-12d3-a456-426614174000",
    "type": "application/pdf",
    "size": 102400,
    "createdAt": "2025-04-01T12:30:00Z",
    "uuid": "123e4567-e89b-12d3-a456-426614174000"
  },
  "plugins": {
    "ocr": "Extracted text from the document",
    "isBlurry": false
  }
}
```

#### Error Response `POST /api/file/upload`

1.  `401 Unauthorized`

    **Occurs when:**

    - The user is not authenticated (missing or invalid JWT token).

    **Response:**

    ```json
    {
      "statusCode": 401,
      "message": "ERR_USER_NOT_AUTHORIZED"
    }
    ```

    ✅ **Fix**: Ensure a valid Authorization: `Bearer <token>` header is included in the request.

2.  `400 Bad Request`

    These errors indicate something is wrong with the request input.

    a. **File Not Provided**

    **Occurs when:**

    - The `file` field is missing from the multipart form-data request.

    **Response:**

    ```json
    {
      "statusCode": 400,
      "message": "ERR_FILE_NOT_FOUND"
    }
    ```

    ✅ **Fix**: Attach a file in the `file` field of the form data.

    b. **File Too Large**

    **Occurs when:**

    - The uploaded file exceeds the maximum file size allowed (default: **10MB**).

    **Response:**

    ```json
    {
      "statusCode": 400,
      "message": "ERR_FILE_EXCEEDS_MAX_SIZE"
    }
    ```

    ✅ **Fix**: Ensure the file size is within the allowed limit.

    > ℹ️ **Note**: The **10MB** limit is configurable and may vary depending on server settings.

3.  `404 Not Found`

    a. **School Not Found**

    **Occurs when:**

    - The `school_id` in the session is invalid or no longer exists in the database.

    **Response:**

    ```json
    {
      "statusCode": 404,
      "message": "ERR_SCHOOL_NOT_FOUND"
    }
    ```

    ✅ **Fix**: This typically indicates stale session data. Try logging out and back in. If the issue persists, report it to the development team.

4.  `500 Internal Server Error`

    **Occurs when:**

    - An unexpected error happens on the server (e.g., disk issues, stream failures, unknown bugs).

    **Response:**

    ```json
    {
      "statusCode": 500,
      "message": "<error details>"
    }
    ```

    ✅ **Fix**: Check the server logs for detailed information. The response message may vary depending on the underlying issue.

### Get File Metadata

**Endpoint:**

```txt
GET /api/file/:uuid/meta
```

#### Path Parameters

- **uuid** (`uuid`): The unique identifier of the file.

#### Request Headers

- **Authorization**: `Bearer <token>` (JWT token for authentication).

#### Success Response `GET /api/file/:uuid/meta`

```json
{
  "success": true,
  "document": {
    "id": 1,
    "name": "example-file.pdf",
    "url": "/api/file/123e4567-e89b-12d3-a456-426614174000",
    "type": "application/pdf",
    "size": 102400,
    "uuid": "123e4567-e89b-12d3-a456-426614174000",
    "createdAt": "2025-04-01T12:30:00Z"
  }
}
```

#### Error Response `GET /api/file/:uuid/meta`

1.  `401 Unauthorized`

    **Occurs when:**

    - The user is not authenticated (missing or invalid JWT token).

    **Response:**

    ```json
    {
      "statusCode": 401,
      "message": "ERR_USER_NOT_AUTHORIZED"
    }
    ```

    ✅ **Fix**: Ensure a valid Authorization: `Bearer <token>` header is included in the request.

2.  `400 Bad Request`

    These errors indicate something is wrong with the request input.

    a. **Invalid UUID**

    **Occurs when:**

    - The `uuid` param is not a valid uuid. Checks default to version `4`.

    **Response:**

    ```json
    {
      "statusCode": 400,
      "message": "ERR_INVALID_UUID"
    }
    ```

    ✅ **Fix**: Ensure that the `uuid` field is a valid uuid v4.

    b. **File Not Exists**

    **Occurs when:**

    - File provided by `uuid` and the session `schoolId` not exists.

    **Response:**

    ```json
    {
      "statusCode": 400,
      "message": "ERR_FILE_NOT_FOUND"
    }
    ```

    ✅ **Fix**: Ensure that the `uuid` field exists on file, and matches with its corresponding `schoolId` field derived from the session.

3.  `500 Internal Server Error`

    **Occurs when:**

    - An unexpected error happens on the server (e.g., disk issues, stream failures, unknown bugs).

    **Response:**

    ```json
    {
      "statusCode": 500,
      "message": "<error details>"
    }
    ```

    ✅ **Fix**: Check the server logs for detailed information. The response message may vary depending on the underlying issue.

### Get File

**Endpoint:**

```txt
GET /api/file/:uuid
```

#### Path Parameters

- **uuid**: The unique identifier of the file.

#### Query Parameters

- **download**: A boolean value to specify whether the file should be downloaded or displayed inline. Defaults to true (download).

**Example:**

```txt
/api/file/123e4567-e89b-12d3-a456-426614174000?download=false
```

#### Request Headers

- **Authorization**: `Bearer <token>` (JWT token for authentication).

#### Success Response `GET /api/file/:uuid`

The response will stream the file content based on the specified download parameter.

#### Error Response `GET /api/file/:uuid`

1.  `401 Unauthorized`

    **Occurs when:**

    - The user is not authenticated (missing or invalid JWT token).

    **Response:**

    ```json
    {
      "statusCode": 401,
      "message": "ERR_USER_NOT_AUTHORIZED"
    }
    ```

    ✅ **Fix**: Ensure a valid Authorization: `Bearer <token>` header is included in the request.

2.  `400 Bad Request`

    These errors indicate something is wrong with the request input.

    a. **Invalid UUID**

    **Occurs when:**

    - The `uuid` param is not a valid uuid. Checks default to version `4`.

    **Response:**

    ```json
    {
      "statusCode": 400,
      "message": "ERR_INVALID_UUID"
    }
    ```

    ✅ **Fix**: Ensure that the `uuid` field is a valid uuid v4.

    b. **Invalid Download Query**

    **Occurs when:**

    - The `download` query param is not a valid boolean string.

    **Response:**

    ```json
    {
      "statusCode": 400,
      "message": "ERR_INVALID_DOWNLOAD_QUERY"
    }
    ```

    ✅ **Fix**: Ensure that the `download` query param is a valid boolean string.

    c. **File Not Exists**

    **Occurs when:**

    - File provided by `uuid` and the session `schoolId` not exists.

    **Response:**

    ```json
    {
      "statusCode": 400,
      "message": "ERR_FILE_NOT_FOUND"
    }
    ```

    ✅ **Fix**: Ensure that the `uuid` field exists on file, and matches with its corresponding `schoolId` field derived from the session.

3.  `500 Internal Server Error`

    **Occurs when:**

    - An unexpected error happens on the server (e.g., disk issues, stream failures, unknown bugs).

    **Response:**

    ```json
    {
      "statusCode": 500,
      "message": "<error details>"
    }
    ```

    ✅ **Fix**: Check the server logs for detailed information. The response message may vary depending on the underlying issue.

### Delete a File

**Endpoint:**

```txt
DELETE /api/file/:file_id
```

#### Path Parameters:

- **file_id**: The ID of the file to be deleted.

#### Request Headers:

- **Authorization**: `Bearer <token>` (JWT token for authentication).

#### Success Response `DELETE /api/file/:file_id`

```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

### Error Response `DELETE /api/file/:file_id`

1.  `401 Unauthorized`

    **Occurs when:**

    - The user is not authenticated (missing or invalid JWT token).

    **Response:**

    ```json
    {
      "statusCode": 401,
      "message": "ERR_USER_NOT_AUTHORIZED"
    }
    ```

    ✅ **Fix**: Ensure a valid Authorization: `Bearer <token>` header is included in the request.

2.  `404 Not Found`

    a. **File Not Exists**

    **Occurs when:**

    - File provided by `file_id` field not exists.

    **Response:**

    ```json
    {
      "statusCode": 404,
      "message": "ERR_FILE_NOT_FOUND"
    }
    ```

    ✅ **Fix**: Ensure that the `file_id` field value exists on file.

3.  `500 Internal Server Error`

    **Occurs when:**

    - An unexpected error happens on the server (e.g., disk issues, stream failures, unknown bugs).

    **Response:**

    ```json
    {
      "statusCode": 500,
      "message": "<error details>"
    }
    ```

    ✅ **Fix**: Check the server logs for detailed information. The response message may vary depending on the underlying issue.

### Explanation of File Encryption and Decryption Flow

Files are encrypted using `AES-256-CBC` before being stored.

When retrieving a file, the server uses the user's unique key and an initialization vector (IV) to decrypt the file.

If the download query parameter is set to true, the file is sent as a downloadable attachment. If set to false, it is streamed inline for viewing (if supported by the browser).
