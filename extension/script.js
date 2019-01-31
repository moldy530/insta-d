const insertDownloadLink = () => {
    // the modal with the image or the page instagram.com/p/* has these spans with icons
    // this is the save icon
    const save = document.querySelector('span[class*="glyphsSpriteSave"]');
    if (!save) { return false; }

    // since the save icons are children of the main image container
    // we can iterate over the parents until we find an img with a src set
    // that img is the image associated with the icon we found above
    const findImage = (currElement) => {
        const img = currElement.parentElement.querySelector('img[srcset]');
        if(img) {
            return img;
        }

        return findImage(currElement.parentElement);
    };

    // we pull the last image in the set since it's meant to be the HQ one
    const getHqImageLink = (img) => {
        const srcSet = img.srcset.split(',');
        return srcSet[srcSet.length - 1].split(' ')[0];
    };

    // we build the link with the dl=1 param so that it will get downloaded
    const imgLink = getHqImageLink(findImage(save)) + '&dl=1';

    // find the closest section container (this is the container for all the icons found above the comments)
    const section = save.closest('section');

    // build our own span to hold our new icon
    const linkContainer = document.createElement('span');
    linkContainer.style.width = '40px';
    linkContainer.style.height = '40px';
    linkContainer.style.display = 'flex';
    linkContainer.style.justifyContent = 'center';
    linkContainer.style.alignItems = 'center';

    section.insertBefore(linkContainer, section.childNodes[section.childNodes.length - 1]);

    const downloadImgUrl = chrome.extension.getURL('images/download.png');

    // this is our icon that downloads the image
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

    return true;
};

const maybeInsertDownloadLink = () => {
    if (window.location.href.indexOf("instagram.com/p/") > -1) {
        return insertDownloadLink();
    }

    return false;
};

// Create a script on the page that will fire off an event when the history changes
// the main feed changes the url when the image modal is opened up
const html = `
    const pushState = history.pushState;
    history.pushState = function(state) {
        if (typeof history.onpushstate === "function") {
            history.onpushstate({state: state});
        }
        const event = new Event('insertdownloadlink');
        window.dispatchEvent(event);
        return pushState.apply(history, arguments);
    }
`;

const headID = document.getElementsByTagName("head")[0];
const newScript = document.createElement('script');
newScript.type = 'text/javascript';
newScript.innerHTML = html;
headID.appendChild(newScript);

// call the maybe insert link function since we might already be on instagram.com/p/*
maybeInsertDownloadLink();

// listen for custom event fired by the script above when the history changes
window.addEventListener('insertdownloadlink', () => {
    const intrvl = setInterval(() => {
        if (maybeInsertDownloadLink()) {
            clearInterval(intrvl);
        }
    }, 10);
});


