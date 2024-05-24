document.addEventListener('DOMContentLoaded', function() {
    const typefaceSelect = document.getElementById('typeface');
    const styleSelect = document.getElementById('style');
    const tierSelect = document.getElementById('tier');
    const priceDisplay = document.getElementById('price');
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

    let productData = {};
    let fontStyleElement = document.createElement('style');
    document.head.appendChild(fontStyleElement);

    const tierLabels = {
        "small-business": "Small Business (under 50 employees)",
        "business": "Business (under 100 employees)",
        "enterprise": "Enterprise (under 1000 employees)",
        "WTFPL": "WTFPL (Free)"
    };

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
        const styles = Object.keys(productData[typeface]).filter(key => key !== 'fontFamily');
        styleSelect.innerHTML = styles.map(style => {
            const styleData = productData[typeface][style];
            const formattedStyle = styleData.label || style;
            return `<option value="${style}">${formattedStyle}</option>`;
        }).join('');
        updateTiers();
        toggleVariableControls();
        toggleEditableBlock();
    }

    function updateTiers() {
        const typeface = typefaceSelect.value;
        const style = styleSelect.value;
        const tiers = Object.keys(productData[typeface][style]).filter(key => key !== 'label' && key !== 'fontFile');
        tierSelect.innerHTML = tiers.map(tier => `<option value="${tier}">${tierLabels[tier]}</option>`).join('');
        updatePrice();
    }

    function updatePrice() {
        const typeface = typefaceSelect.value;
        const style = styleSelect.value;
        const tier = tierSelect.value;
        const price = productData[typeface][style][tier].price;
        priceDisplay.textContent = `$${price}`;
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
        toggleEditableBlock();
    }

    function toggleVariableControls() {
        const typeface = typefaceSelect.value;
        const style = styleSelect.value;
        if (typeface === 'AuthenticSansPro' && style === 'Variable') {
            variableControls.style.display = 'block';
            editableBlock.style.fontVariationSettings = `'wght' ${weightSlider.value}, 'wdth' ${widthSlider.value}`;
        } else {
            variableControls.style.display = 'none';
            editableBlock.style.fontVariationSettings = '';
        }
    }

    function toggleEditableBlock() {
        const typeface = typefaceSelect.value;
        const style = styleSelect.value;
        if (style === 'Family' || style === 'RegularFamily' || style === 'CondensedFamily') {
            editableBlock.style.display = 'none';
            fontSizeSlider.style.display = 'none';
            lineHeightSlider.style.display = 'none';
            fontSizeLabel.style.display = 'none';
            lineHeightLabel.style.display = 'none';
        } else {
            editableBlock.style.display = 'block';
            fontSizeSlider.style.display = 'block';
            lineHeightSlider.style.display = 'block';
            fontSizeLabel.style.display = 'block';
            lineHeightLabel.style.display = 'block';
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
        infoLinksContainer.innerHTML = '';
    
        if (infoLinks) {
            infoLinksLabel.style.display = "block";
            Object.keys(infoLinks).forEach(label => {
                const button = document.createElement('button');
                button.textContent = label;
                button.onclick = () => window.open(infoLinks[label], '_blank');
                infoLinksContainer.appendChild(button);
            });
        } else {
            infoLinksLabel.style.display = "none";
        }
    }
      
    typefaceSelect.addEventListener('change', () => {
        updateStyles();
        updateFont();
        updateAddToCartLink();
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
    
});
