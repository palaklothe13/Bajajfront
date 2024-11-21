const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const isPrime = (num) => {
  const n = parseInt(num, 10);
  if (isNaN(n) || n <= 1) return false;
  for (let i = 2; i < n; i++) {
    if (n % i === 0) return false;
  }
  return true;
};

app.post("/bfhl", async (req, res) => {
  const { data, file_b64 } = req.body;

  const userId = "palak_lothe_13112003";
  const email = "palaklothe210102@acropolis.in";
  const rollNumber = "0827CS211166";

  if (!data || !Array.isArray(data)) {
    return res.status(400).json({
      is_success: false,
      error: "Invalid or missing 'data' field in the request.",
    });
  }

  const numbers = data.filter((item) => !isNaN(item));
  const alphabets = data.filter((item) => isNaN(item));

  const highestLowercase =
    alphabets
      .filter((item) => item === item.toLowerCase())
      .sort()
      .pop() || null;

  const isPrimeFound = numbers.some((num) => isPrime(num));

  let fileValid = false;
  let fileMimeType = null;
  let fileSizeKb = null;

  if (file_b64) {
    try {
      const fileBuffer = Buffer.from(file_b64, "base64");
      fileSizeKb = (fileBuffer.length / 1024).toFixed(2);

      const { fileTypeFromBuffer } = await import("file-type");
      const fileType = await fileTypeFromBuffer(fileBuffer);
      if (fileType) {
        fileMimeType = fileType.mime;
        fileValid = true;
      } else {
        fileMimeType = "unknown";
      }
    } catch (error) {
      fileValid = false;
    }
  }

  const response = {
    is_success: true,
    user_id: userId,
    email: email,
    roll_number: rollNumber,
    numbers,
    alphabets,
    highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : [],
    is_prime_found: isPrimeFound,
    file_valid: file_b64 ? fileValid : false,
  };

  if (file_b64 && fileValid) {
    response.file_mime_type = fileMimeType;
    response.file_size_kb = fileSizeKb;
  }

  res.status(200).json(response);
});

app.get("/bfhl", (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
