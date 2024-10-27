// alphabet
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/-*^!$%&()=<>[]{}@~#?|;,.":_';

// Encode a byte array into a encrypt string
function encrypt(byteArray) {
    let output = '';
    let buffer = 0;
    let count = 0;

    for (let i = 0; i < byteArray.length; i++) {
        buffer = (buffer << 8) | byteArray[i];  // Shift buffer 8 bits to the left and OR with the current byte
        count++;

        // Process every 4 bytes (32 bits)
        if (count === 4) {
            for (let j = 4; j >= 0; j--) {
                output += ALPHABET[(buffer / Math.pow(85, j)) % 85 | 0];
            }
            buffer = 0;  // Reset buffer
            count = 0;   // Reset count
        }
    }

    // Handle remaining bytes (padding)
    if (count > 0) {
        buffer <<= (4 - count) * 8;  // Pad buffer with zeros
        for (let j = 4; j >= 4 - count; j--) {
            output += ALPHABET[(buffer / Math.pow(85, j)) % 85 | 0];
        }
    }

    return output;
}


// Decode the string into a byte array
function decrypt(String) {
    let output = [];
    let buffer = 0;
    let count = 0;

    for (let i = 0; i < String.length; i++) {
        buffer = buffer * 85 + ALPHABET.indexOf(String[i]);  // Accumulate the values
        count++;

        // Process every 5 characters (32 bits)
        if (count === 5) {
            for (let j = 3; j >= 0; j--) {
                output.push((buffer >> (j * 8)) & 0xFF);  // Extract each byte from the buffer
            }
            buffer = 0;  // Reset buffer
            count = 0;   // Reset count
        }
    }

    // Handle remaining characters (padding)
    if (count > 0) {
        for (let i = count; i < 5; i++) {
            buffer = buffer * 85 + 84;  // Pad with 'z' equivalent
        }
        for (let j = 3; j >= 4 - count; j--) {
            output.push((buffer >> (j * 8)) & 0xFF);  // Extract remaining bytes
        }
    }

    return new Uint8Array(output);
}