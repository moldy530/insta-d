const save = document.querySelector('span[class*="glyphsSpriteSave"]');

const findImage = (currElement) => {
    const img = currElement.parentElement.querySelector('img[srcset]');
    if(img) {
        return img;
    }

    return findImage(currElement.parentElement);
};

const getHqImageLink = (img) => {
    const srcSet = img.srcset.split(',');
    return srcSet[srcSet.length - 1].split(' ')[0];
};

const imgLink = getHqImageLink(findImage(save)) + '&dl=1';
const section = save.closest('section');

const linkContainer = document.createElement('span');
linkContainer.style.width = '40px';
linkContainer.style.height = '40px';
linkContainer.style.display = 'flex';
linkContainer.style.justifyContent = 'center';
linkContainer.style.alignItems = 'center';

section.insertBefore(linkContainer, section.childNodes[section.childNodes.length - 1]);

const downloadImgUrl = chrome.extension.getURL('images/download.png');

const link = document.createElement('a');
link.style.display = 'block';
link.style.width = '24px';
link.style.height = '24px';
link.style.backgroundImage = `url('${downloadImgUrl}')`;
link.style.backgroundSize = '24px 24px';
link.style.backgroundPosition = 'center';
link.href = imgLink;
link.target = '_blank';

linkContainer.append(link);


