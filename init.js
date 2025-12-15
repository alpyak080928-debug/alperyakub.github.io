document.addEventListener('DOMContentLoaded', () => {

    function createFooter() {
        const footerHTML = `
            <footer class="footer">
                <div class="container footer-grid">
                    <div class="footer-section">
                        <h3>JAX Apparel</h3>
                        <p>Modern design för alla generationer.</p>
                    </div>

                    <div class="footer-section">
                        <h3>Länkar</h3>
                        <ul>
                            <li><a href="index.html">Hem</a></li>
                            <li><a href="kollektioner.html">Kollektioner</a></li>
                            <li><a href="omoss.html">Om Oss</a></li>
                            <li><a href="kontakt.html">Kontakt</a></li>
                            <li><a href="kundvagn.html">Kundvagn</a></li>
                        </ul>
                    </div>

                    <div class="footer-section">
                        <h3>Kontakt</h3>
                        <p>info@jaxapparel.se</p>
                        <p>+46 8 455423</p>
                    </div>
                </div>

                <div class="footer-bottom">
                    &copy; 2025 JAX Apparel. Alla rättigheter reserverade.
                </div>
            </footer>
        `;

        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            footerPlaceholder.innerHTML = footerHTML;
        }
    }

    createFooter();

    const mainProductImage = document.getElementById('main-product-image');
    const thumbnails = document.querySelectorAll('.thumbnail-gallery .thumbnail');

    if (mainProductImage && thumbnails.length > 0) {
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', () => {
                const fullSrc = thumbnail.getAttribute('data-full-src');
                mainProductImage.src = fullSrc;
                mainProductImage.alt = thumbnail.alt.replace('miniatyr', ''); 

                thumbnails.forEach(t => t.classList.remove('selected-thumbnail'));
                thumbnail.classList.add('selected-thumbnail');
            });
        });
    }

    const sizeButtons = document.querySelectorAll('.size-selector button');
    sizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            sizeButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
        });
    });

    const purchaseForm = document.getElementById('purchase-form');
    const alertBox = document.getElementById('product-added-alert');
    if (purchaseForm && alertBox) {
        purchaseForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            alertBox.style.display = 'block';
            setTimeout(() => {
                alertBox.style.opacity = 1;
            }, 10);

            setTimeout(() => {
                alertBox.style.opacity = 0;
                setTimeout(() => {
                    alertBox.style.display = 'none';
                }, 500); 
            }, 2000);
        });
    }
});