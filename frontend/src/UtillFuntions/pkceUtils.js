export function generateCodeVerifier(length = 56){
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => ('0' + byte.toString(36)).slice(-2)).join('');
}

// function base64URLEncode(arrayBuffer){
//     const binaryString = String.fromCharCode(...new Uint8Array(arrayBuffer));
//     const base64String = window.btoa(binaryString)
//     .replace(/\+/g, '-')
//     .replace(/\//g, '_')
//     .replace(/=+$/, '');
//     return base64String;
// }

export async function generateCodeChallenge(codeVerifier){
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const hash = await window.crypto.subtle.digest('SHA-256', data);
    const base64String = btoa(String.fromCharCode(...new Uint8Array(hash)));
    return base64String
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+/g, '');
}
