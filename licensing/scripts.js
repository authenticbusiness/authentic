document.addEventListener('DOMContentLoaded', function() {
    const typefaceSelect = document.getElementById('typeface');
    const styleSelect = document.getElementById('style');
    const tierSelect = document.getElementById('tier');
    const priceDisplay = document.getElementById('price');
    const addToCartLink = document.getElementById('addToCartLink');
    const editableBlock = document.getElementById('editableBlock');
    const variableControls = document.getElementById('variableControls');
    const weightSlider = document.getElementById('weightSlider');
    const widthSlider = document.getElementById('widthSlider');
    const fontSizeSlider = document.getElementById('fontSizeSlider');
    const lineHeightSlider = document.getElementById('lineHeightSlider');

    let productData = {};

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

        const newStyle = document.createElement('style');
        newStyle.appendChild(document.createTextNode(`
            @font-face {
                font-family: '${fontFamily}';
                src: url('${fontFile}');
            }
        `));

        document.head.appendChild(newStyle);
        editableBlock.style.fontFamily = fontFamily;
        toggleVariableControls();
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

    function updateAddToCartLink() {
        const typeface = typefaceSelect.value;
        const style = styleSelect.value;
        const tier = tierSelect.value;
        const link = productData[typeface][style][tier].link;
        addToCartLink.href = link;
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

    addToCartLink.addEventListener('click', function(event) {
        event.preventDefault();
        const typeface = typefaceSelect.value;
        const style = styleSelect.value;
        const tier = tierSelect.value;
        const link = productData[typeface][style][tier].link;
        addToCartLink.href = link;
        sendOwl.captureLinks();
        sendOwl.purchaseHandler({ target: addToCartLink });
    });
});
