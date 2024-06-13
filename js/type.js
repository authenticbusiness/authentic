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

    fetch('json/products.json')
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
            if (productData[typeface]) {
                const styles = Object.keys(productData[typeface]).filter(key => !['fontFamily', 'infoLinks', 'glyphs'].includes(key));
                styleSelect.innerHTML = styles.map(style => {
                    const styleData = productData[typeface][style];
                    const formattedStyle = styleData.label || style;
                    return `<option value="${style}">${formattedStyle}</option>`;
                }).join('');
            }
            updateTiers();
            toggleVariableControls();
        }
        


        function updateTiers() {
            const typeface = typefaceSelect.value;
            const style = styleSelect.value;
            if (productData[typeface] && productData[typeface][style]) {
                const tiers = Object.keys(productData[typeface][style]).filter(key => key !== 'label' && key !== 'fontFile' && key !== 'glyphs');
                tierSelect.innerHTML = tiers.map(tier => {
                    const tierLabel = productData.licenses[tier].label;
                    return `<option value="${tier}">${tierLabel}</option>`;
                }).join('');
            } else {
                tierSelect.innerHTML = '';
            }
            updatePrice();
        }
        

    function updatePrice() {
        const typeface = typefaceSelect.value;
        const style = styleSelect.value;
        const tier = tierSelect.value;
        const price = productData[typeface][style][tier].price;
        addToCartBtn.textContent = `$${price}`;
    }

    function loadFont(fontName, fontFile) {
        const font = new FontFaceObserver(fontName);
    
        font.load().then(function() {
            document.fonts.add(new FontFace(fontName, `url(${fontFile})`));
            document.body.classList.add('fonts-loaded');
        }).catch(function() {
            console.error(`Failed to load font: ${fontName}`);
        });
    }

    function updateFont() {
        const typeface = typefaceSelect.value;
        const style = styleSelect.value;
        if (productData[typeface] && productData[typeface][style]) {
            const fontFamily = productData[typeface].fontFamily;
            const fontFile = productData[typeface][style].fontFile;
        
            if (fontFile) {
                loadFont(fontFamily, fontFile);
                fontStyleElement.innerHTML = `
                    @font-face {
                        font-family: '${fontFamily}';
                        src: url('${fontFile}');
                    }
                `;
                document.documentElement.style.setProperty('--current-font-family', fontFamily);
                editableBlock.style.fontFamily = fontFamily;
            }
        
            toggleVariableControls();
        }
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
        if (productData[typeface] && productData[typeface][style] && productData[typeface][style][tier]) {
            const link = productData[typeface][style][tier].link;
            addToCartBtn.dataset.href = link;
        } else {
            addToCartBtn.dataset.href = '';
        }
    }
    
    function updateInfoLinks() {
        const typeface = typefaceSelect.value;
        const style = styleSelect.value;
        const tier = tierSelect.value;
        if (productData[typeface] && productData[typeface][style]) {
            const infoLinks = productData[typeface].infoLinks;
            const licenseInfo = productData.licenses[tier];
            const glyphs = productData[typeface][style].glyphs || productData[typeface].glyphs;
            infoLinksContainer.innerHTML = '';
            
            let hasInfo = false;
            let linksArray = [];
        
            // Add License button
            if (licenseInfo) {
                hasInfo = true;
                linksArray.push({ text: 'License', action: openInfoModal });
            }
        
            // Add Glyphs button
            if (glyphs) {
                hasInfo = true;
                linksArray.push({ text: 'Glyphs', action: openGlyphsModal });
            }
        
            // Add other info links
            if (infoLinks) {
                hasInfo = true;
                Object.keys(infoLinks).forEach(label => {
                    linksArray.push({ text: label, action: () => window.open(infoLinks[label], '_blank') });
                });
            }
        
            // Append all links to the container
            linksArray.forEach((link, index) => {
                const button = document.createElement('button');
                button.textContent = link.text;
                button.onclick = link.action;
                infoLinksContainer.appendChild(button);
                if (index < linksArray.length - 1) {
                    const commaText = document.createTextNode(', ');
                    infoLinksContainer.appendChild(commaText);
                }
            });
        
            infoLinksLabel.style.display = hasInfo ? "inline" : "none";
        }
    }
    

    function openInfoModal() {
        const typeface = typefaceSelect.value;
        const tier = tierSelect.value;
        const licenseInfo = productData.licenses[tier];

        modalContent.innerHTML = `<h2>${licenseInfo.label}</h2><p>${licenseInfo.info}</p>`;
        infoModal.style.display = 'block';
    }

    function closeInfoModal() {
        infoModal.style.display = 'none';
    }

    function openGlyphsModal() {
        const typeface = typefaceSelect.value;
        const style = styleSelect.value;
        const glyphs = productData[typeface][style].glyphs || productData[typeface].glyphs;
        modalGlyphsContent.innerHTML = `<h2>Glyphs</h2><p>${glyphs}</p>`;
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
        updateInfoLinks();
    });
    
    tierSelect.addEventListener('change', () => {
        updatePrice();
        updateAddToCartLink();
    });

    weightSlider.addEventListener('input', () => {
        editableBlock.style.fontVariationSettings = `'wght' ${weightSlider.value}, 'wdth' ${widthSlider.value}`;
    });

    widthSlider.addEventListener('input', () => {
        editableBlock.style.fontVariationSettings = `'wght' ${weightSlider.value}, 'wdth' ${widthSlider.value}`;
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

    window.openInfoModal = openInfoModal;
    window.closeInfoModal = closeInfoModal;
    window.openGlyphsModal = openGlyphsModal;
    window.closeGlyphsModal = closeGlyphsModal;
});
