function makeResizableDiv(div) {
    const element = document.querySelector(div);
    const resizers = document.querySelectorAll(div + " .resizer");
    const minimum_size = 20;
    let original_width = 0;
    let original_height = 0;
    let original_x = 0;
    let original_y = 0;
    let original_mouse_x = 0;
    let original_mouse_y = 0;

    for (let i = 0;i < resizers.length; i++) {
        const currentResizer = resizers[i];

        currentResizer.addEventListener("mousedown", function(e) {
            e.preventDefault();
            original_width = parseFloat(getComputedStyle(element, null).getPropertyValue("width").replace("px", ""));
            original_height = parseFloat(getComputedStyle(element, null).getPropertyValue("height").replace("px", ""));
            original_x = element.getBoundingClientRect().left;
            original_y = element.getBoundingClientRect().top;
            original_mouse_x = e.pageX;
            original_mouse_y = e.pageY;
            window.addEventListener("mousemove", resize);
            window.addEventListener("mouseup", stopResize);
        });

        function resize(e) {
            if (currentResizer.classList.contains("bottom")) {
                const height = original_height + (e.pageY - original_mouse_y);
                if (height > minimum_size) {
                    element.style.height = height + "px";
                }
            }
        }

        function stopResize() {
            console.log(true);
            window.removeEventListener("mousemove", resize);
        }
    }
}

makeResizableDiv(".mat-card-content#mat_image_init");
makeResizableDiv(".mat-card-content#mat_image_changed");