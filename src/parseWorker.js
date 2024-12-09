// parseWorker.js
// Keep old comments:
// We originally tried to decode incrementally. Now we will simplify: 
// - Store all chunks
// - After receiving 'done', concatenate and decode once.

import { decode } from '@msgpack/msgpack';

// We no longer need Decoder in streaming mode. We can just decode once at the end.
// let decoder = new Decoder(); // old line, remove it

let chunks = [];
let totalBytes = 0;
let doneReceivingChunks = false;

onmessage = (e) => {
  const { type } = e.data;

  if (type === 'chunk') {
    // Keep old comment:
    // Append this chunk to our list of chunks.
    const chunk = new Uint8Array(e.data.chunk);
    chunks.push(chunk);
    totalBytes += chunk.byteLength;

    // We can optionally post progress if we know total size. 
    // But we might not know the total file size. If we do:
    // postMessage({ type: 'progress', processed: totalBytes, total: file.size (if known) });
    // For now, just keep it simple.
    
  } else if (type === 'done') {
    // No more chunks are coming.
    doneReceivingChunks = true;
    // Now we try decoding once.
    decodeAll();
  }
};

function decodeAll() {
  // Keep old comments if relevant:
  // Concat all chunks into one Uint8Array
  const fullData = new Uint8Array(totalBytes);
  let offset = 0;
  for (const c of chunks) {
    fullData.set(c, offset);
    offset += c.byteLength;
  }

  chunks = []; // free memory

  try {
    // Decode once
    const val = decode(fullData);
    // val should be our single large object with { locations: [...], items: [...] }

    // Send done message with the decoded data wrapped in an array for consistency with previous logic
    postMessage({ type: 'done', data: [val] });
  } catch (err) {
    // If there's a decoding error, we handle it here
    console.error('Decoding error:', err);
    postMessage({ type: 'error', error: err.message });
  }
}
