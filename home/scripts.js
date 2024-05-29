document.addEventListener('DOMContentLoaded', function() {
    const typefaceSelect = document.getElementById('typeface');
    const styleSelect = document.getElementById('style');
    const tierSelect = document.getElementById('tier');
    const addToCartBtn = document.getElementById('addToCartBtn');
    const editableBlock = document.getElementById('editableBlock');
    const variableControls = document.getElementById('variableControls');
    const weightSlider = document.getElementById('weightSlider');
    const widthSlider = document.getElementById('widthSlider');
    const fontSizeSlider = document.getElementById('fontSizeSlider');
    const lineHeightSlider = document.getElementById('lineHeightSlider');
    const fontSizeLabel = document.getElementById('fontSizeLabel');
    const lineHeightLabel = document.getElementById('lineHeightLabel');
    const viewCartBtn = document.getElementById('viewCartBtn');
    const infoLinksContainer = document.getElementById('infoLinksContainer');
    const infoLinksLabel = document.getElementById('infoLinksLabel');
    const infoModal = document.getElementById('infoModal');
    const modalContent = document.getElementById('modalInfoContent');
    const glyphsModal = document.getElementById('glyphsModal');
    const modalGlyphsContent = document.getElementById('modalGlyphsContent');

    let productData = {};
    let fontStyleElement = document.createElement('style');
    document.head.appendChild(fontStyleElement);

    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            productData = data;
            updateStyles();
            updatePrice();
            updateFont();
            updateAddToCartLink();
            updateInfoLinks();
        });

    function updateStyles() {
        const typeface = typefaceSelect.value;
        const styles = Object.keys(productData[typeface]).filter(key => !['fontFamily', 'infoLinks', 'glyphs'].includes(key));
        styleSelect.innerHTML = styles.map(style => {
            const styleData = productData[typeface][style];
            const formattedStyle = styleData.label || style;
            return `<option value="${style}">${formattedStyle}</option>`;
        }).join('');
        updateTiers();
        toggleVariableControls();
    }

    function updateTiers() {
        const typeface = typefaceSelect.value;
        const style = styleSelect.value;
        const tiers = Object.keys(productData[typeface][style]).filter(key => key !== 'label' && key !== 'fontFile');
        tierSelect.innerHTML = tiers.map(tier => {
            const tierLabel = productData.licenses[tier].label;
            return `<option value="${tier}">${tierLabel}</option>`;
        }).join('');
        updatePrice();
    }

    function updatePrice() {
        const typeface = typefaceSelect.value;
        const style = styleSelect.value;
        const tier = tierSelect.value;
        const price = productData[typeface][style][tier].price;
        addToCartBtn.textContent = `$${price}`;
    }

    function updateFont() {
        const typeface = typefaceSelect.value;
        const style = styleSelect.value;
        const fontFamily = productData[typeface].fontFamily;
        const fontFile = productData[typeface][style].fontFile;

        if (fontFile) {
            fontStyleElement.innerHTML = `
                @font-face {
                    font-family: '${fontFamily}';
                    src: url('${fontFile}');
                }
            `;
            editableBlock.style.fontFamily = fontFamily;
        }

        toggleVariableControls();
    }

    function toggleVariableControls() {
        const typeface = typefaceSelect.value;
        const style = styleSelect.value;
        if (typeface === 'AuthenticSansPro' && style === 'Variable') {
            variableControls.style.display = 'flex';
            editableBlock.style.fontVariationSettings = `'wght' ${weightSlider.value}, 'wdth' ${widthSlider.value}`;
        } else {
            variableControls.style.display = 'none';
            editableBlock.style.fontVariationSettings = '';
        }
    }

    function updateAddToCartLink() {
        const typeface = typefaceSelect.value;
        const style = styleSelect.value;
        const tier = tierSelect.value;
        const link = productData[typeface][style][tier].link;
        addToCartBtn.dataset.href = link;
    }

    function updateInfoLinks() {
        const typeface = typefaceSelect.value;
        const infoLinks = productData[typeface].infoLinks;
        const glyphs = productData[typeface].glyphs;
        infoLinksContainer.innerHTML = '';
    
        let hasInfo = false;

        if (glyphs) {
            hasInfo = true;
            const glyphsButton = document.createElement('button');
            glyphsButton.textContent = 'Glyphs';
            glyphsButton.onclick = openGlyphsModal;
            infoLinksContainer.appendChild(glyphsButton);
        }

        if (infoLinks) {
            hasInfo = true;
            Object.keys(infoLinks).forEach(label => {
                const button = document.createElement('button');
                button.textContent = label;
                button.onclick = () => window.open(infoLinks[label], '_blank');
                infoLinksContainer.appendChild(button);
            });
        }

        infoLinksLabel.style.display = hasInfo ? "inline" : "none";
    }
    
    function openInfoModal() {
        const typeface = typefaceSelect.value;
        const tier = tierSelect.value;
        const licenseInfo = productData.licenses[tier];

        modalContent.innerHTML = `<h2>${licenseInfo.label}</h2><br><p>${licenseInfo.info}</p>`;
        infoModal.style.display = 'block';
    }

    function closeInfoModal() {
        infoModal.style.display = 'none';
    }

    function openGlyphsModal() {
        const typeface = typefaceSelect.value;
        const glyphs = productData[typeface].glyphs.split('').join(' ');
        modalGlyphsContent.innerHTML = `<h2>Glyphs</h2><br><p>${glyphs}</p>`;
        glyphsModal.style.display = 'block';
    }

    function closeGlyphsModal() {
        glyphsModal.style.display = 'none';
    }

    // Close modals when clicking outside of the modal content
    window.onclick = function(event) {
        if (event.target == infoModal) {
            closeInfoModal();
        }
        if (event.target == glyphsModal) {
            closeGlyphsModal();
        }
    }

    // Close modals when pressing the "Escape" key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeInfoModal();
            closeGlyphsModal();
        }
    });

    typefaceSelect.addEventListener('change', () => {
        updateStyles();
        updateFont();
        updateAddToCartLink();
        updateInfoLinks();
    });

    styleSelect.addEventListener('change', () => {
        updateTiers();
        updateFont();
        updateAddToCartLink();
    });

    tierSelect.addEventListener('change', () => {
        updatePrice();
        updateAddToCartLink();
    });

    weightSlider.addEventListener('input', () => {
        editableBlock.style.fontVariationSettings = `'wght' ${weightSlider.value}, 'wdth' ${widthSlider.value}`;
    });

    widthSlider.addEventListener('input', () => {
        editableBlock.style.fontVariationSettings = `'wght' ${widthSlider.value}, 'wdth' ${widthSlider.value}`;
    });

    fontSizeSlider.addEventListener('input', () => {
        editableBlock.style.fontSize = `${fontSizeSlider.value}px`;
    });

    lineHeightSlider.addEventListener('input', () => {
        editableBlock.style.lineHeight = lineHeightSlider.value;
    });

    addToCartBtn.addEventListener('click', function(event) {
        event.preventDefault();
        const link = addToCartBtn.dataset.href;
        if (link) {
            const tempLink = document.createElement('a');
            tempLink.href = link;
            tempLink.classList.add('sendowl-buy-button');
            document.body.appendChild(tempLink);
            sendOwl.captureLinks();
            sendOwl.purchaseHandler({ target: tempLink });
            document.body.removeChild(tempLink);
        }
    });

    viewCartBtn.addEventListener('click', function(event) {
        event.preventDefault();
        const tempLink = document.createElement('a');
        tempLink.href = 'https://transactions.sendowl.com/cart?merchant_id=41972';
        tempLink.classList.add('sendowl-cart-button');
        document.body.appendChild(tempLink);
        sendOwl.captureLinks();
        sendOwl.purchaseHandler({ target: tempLink });
        document.body.removeChild(tempLink);
    });

    typefaceSelect.addEventListener('change', () => {
        updateStyles();
        updateFont();
        updateAddToCartLink();
        updateInfoLinks();
    });

    window.openInfoModal = openInfoModal;
    window.closeInfoModal = closeInfoModal;
    window.openGlyphsModal = openGlyphsModal;
    window.closeGlyphsModal = closeGlyphsModal;
});
