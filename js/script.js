        // Example countdown function
        document.querySelectorAll('.countdown').forEach(el => {
            let days = parseInt(el.textContent);
            let interval = setInterval(() => {
                days--;
                if(days <= 0) { el.textContent = 'Coming Today!'; clearInterval(interval); return; }
                el.textContent = days + ' days left';
            }, 86400000); // 1 day in ms
        });