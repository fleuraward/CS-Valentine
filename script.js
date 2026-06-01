// ==UserScript==
// @name         CS Valentine - Image fixes
// @namespace    http://tampermonkey.net/
// @version      20260601.01
// @description  fixing images across cs to fit theme
// @author       june "layercake" "fleuraward" claw
// @match        https://www.chickensmoothie.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chickensmoothie.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/580433/CS%20Silver-studded%20Blue%20-%20Image%20fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/580433/CS%20Silver-studded%20Blue%20-%20Image%20fixes.meta.js
// ==/UserScript==
(function () {
    'use strict';
    // images for the adopt section
const adoptandstoreimgs = {
    'dogs': 'https://raw.githubusercontent.com/fleuraward/CS-Valentine/refs/heads/main/assets/dogs.png',
    'horses':'https://raw.githubusercontent.com/fleuraward/CS-Valentine/refs/heads/main/assets/horses.png',
    'cats':'https://raw.githubusercontent.com/fleuraward/CS-Valentine/refs/heads/main/assets/cats.png',
    'butterfly wolves':'https://raw.githubusercontent.com/fleuraward/CS-Valentine/refs/heads/main/assets/butterflywolves.png',
    'rodents':'https://raw.githubusercontent.com/fleuraward/CS-Valentine/refs/heads/main/assets/rodents.png',
    'second-generation pets':'https://raw.githubusercontent.com/fleuraward/CS-Valentine/refs/heads/main/assets/2ndgens.png',
    'hatchery':'https://raw.githubusercontent.com/fleuraward/CS-Valentine/refs/heads/main/assets/hatchery.png',
    'other':'https://raw.githubusercontent.com/fleuraward/CS-Valentine/refs/heads/main/assets/other.png',
    'special event':'https://raw.githubusercontent.com/fleuraward/CS-Valentine/refs/heads/main/assets/specialevent.png',

    'category.php?id=8': 'https://raw.githubusercontent.com/fleuraward/CS-Valentine/refs/heads/main/assets/accessories.png',
    'category.php?id=11': 'https://raw.githubusercontent.com/fleuraward/CS-Valentine/refs/heads/main/assets/wigs.png',
    'category.php?id=2': 'https://raw.githubusercontent.com/fleuraward/CS-Valentine/refs/heads/main/assets/costumes.png',
    'category.php?id=3': 'https://raw.githubusercontent.com/fleuraward/CS-Valentine/refs/heads/main/assets/casual.png',
    'category.php?id=5': 'https://raw.githubusercontent.com/fleuraward/CS-Valentine/refs/heads/main/assets/objects.png',
    'category.php?id=1': 'https://raw.githubusercontent.com/fleuraward/CS-Valentine/refs/heads/main/assets/extra.png',
    'category.php?id=7': 'https://raw.githubusercontent.com/fleuraward/CS-Valentine/refs/heads/main/assets/pets.png',
    'category.php?id=9': 'https://raw.githubusercontent.com/fleuraward/CS-Valentine/refs/heads/main/assets/specials.png'
};

    // images for the forum pages
    const forumnimgs = {
        'forum_unread_subforum.gif': 'https://raw.githubusercontent.com/fleuraward/CS-Valentine/refs/heads/main/assets/forum_unread_subforum.png',
        'forum_unread.gif': 'https://raw.githubusercontent.com/fleuraward/CS-Valentine/refs/heads/main/assets/forum_unread.png'
    };

    // replace forum background images
    function processBackground(el) {
        try {
            const bg = getComputedStyle(el).backgroundImage;

            for (const key in forumnimgs) {
                if (bg.includes(key)) {
                    el.style.backgroundImage = `url("${forumnimgs[key]}")`;
                }
            }
        } catch (e) {}
    }

    function processImage(img) {
        if (!img?.src) return;

        // fix pet img bgs to fit theme
        try {
            const imgUrl = new URL(img.src);

            const petsandarchive = {
                'e0f6b2': 'ffdaf1', // pet images across site
                '99c57c': 'f587cb', // archive images
                'c6e194': 'ffb5e3' // pets in trades
            };

            const currentBg = imgUrl.searchParams.get('bg');

            if (petsandarchive[currentBg]) {
                imgUrl.searchParams.set('bg', petsandarchive[currentBg]);
                img.src = imgUrl.toString();
            }
        } catch (e) {}

        // fix the adopt images
        const link = img.closest('li.iewibl a');

        if (link) {
            try {
                const href = link.getAttribute('href');

                if (adoptandstoreimgs[href]) {
                    img.src = adoptandstoreimgs[href];
                }

            } catch (e) {}
        }
    }

    document.querySelectorAll('dl').forEach(processBackground);
    document.querySelectorAll('img').forEach(processImage);

    // observer to process the images for all
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType !== 1) return;

                if (node.tagName === 'DL') {
                    processBackground(node);
                }

                node.querySelectorAll?.('dl').forEach(processBackground);

                if (node.tagName === 'IMG') {
                    processImage(node);
                }

                node.querySelectorAll?.('img').forEach(processImage);
            });
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();