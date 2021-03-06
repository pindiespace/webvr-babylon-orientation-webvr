var domui = ( function () {

    // Ui elements

    var messages = [],

    name = 'dom-ui-',

    messageStr = '-message',

    buttonStr = '-button',

    progressStr = '-progress',

    containerStr = '-container',

    controlPanel = null,

    textContainer = null,

    buttonContainer = null,

    linkContainer = null,

    fadeInInc = 10, // milliseconds between fadeIn increment

    fadeOutInc = 50, // milliseconds between fadeOut increment

    fadeDelay = 5000, // number of seconds until fading alerts begin fading

    counter = 0;

    /* 
     * Set ids used for DOM elements used in the Ui to a custom value.
     * @param {String} id the base Id value (incremented with counter)
     * @param {String} msgId added to text messages in dialogs
     * @param {String} buttonId added to buttons in dialogs
     */
    function setIds ( id, msgId, buttonId ) {

        if ( id ) {

            name = id;

        }

        if ( msgId ) {

            messageStr = msgId;
        }

        if ( buttonId ) {

            buttonStr = buttonId;
        }
    }

    /** 
     * Get the element, either directly (just pass through) or by its id
     * @param {DOMElement|String} elem DOM element we want to get.
     */
    function getElement ( elem ) {

        var e;

        if ( typeof elem === 'string' ) {

            e = document.getElementById( elem );

            if ( ! e ) {

                console.error( 'domui.getElement():' + elem + ' not found in DOM');

                e = false;

            }

        } else {

           e = elem;

        }

        return e;

    };

    /** 
     * get the width of the window
     */
    function getScreenWidth () {
        return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    };

    /** 
     * get the height of the window
     */
    function getScreenHeight () {
        return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    };

    /**
     * Replace <canvas> tags with warning images in
     * browsers that can't support THREE or other libraries
     * with a 3d canvas context. If the <canvas> tag hasn't 
     * been created yet, optionally attach a warning image to 
     * a supplied parent DOMElement.
     * @param {String} imgPath the path to the replacement image.
     * @param {DOMElement} container if no <canvas> optionally supply a container to 
     * attach the image to.
     */
    function replaceCanvasWithImage ( imgPath, container ) {

        var img;

        var c = document.getElementsByTagName( 'canvas' );

        // if no <canvas> exists, optionally append to supplied container element

        if ( ! c[0] ) {

            console.warn( 'dom-ui.replaceCanvasWithImage() warning: no <canvas> found.' );

            if ( ! container ) {

                console.warn( 'dom-ui.replaceCanvasWithImage() warning: no container, use document.body');

                container = document.body;

            }

            img = document.createElement( 'img' );

            img.src = imgPath;

            img.style.display = 'block';

            img.style.margin = 'auto';

            // set container to relative positioning so centering works

            container.style.position = 'relative';

            container.appendChild( img );

            return;

        }

        // Replace each canvas with a default image

        for( var i = 0; i < c.length; i++ ) {

            img = document.createElement( 'img' );

            img.src = imgPath;

            var parentNode = c[i].parentNode;

            parentNode.insertBefore( img, c[i] );

            var oldNode = parentNode.removeChild( c[i] );

            oldNode = null;

        }

    };

    /** 
     * Fade in an element
     * @param {DOMElement} elem the DOM element to fade
     * @param {Number} inc the fading increment
     * @param {Function} callback function to execute after fade complete
     */
    function fadeIn ( elem, inc, callback ) {

        var op = 0.1;  // initial opacity

        elem.style.display = 'block';

        var t = setInterval( function () {

            if ( op >= 1 ) {

                clearInterval( t );

            }

            elem.style.opacity = op;

            elem.style.filter = 'alpha(opacity=' + op * 100 + ")";

            op += op * inc;

        }, fadeInInc );

    };

    /** 
     * Fade out an element.
     * @param {DOMElement} elem the DOM element to fade
     * @param {Number} inc the fading increment
     * @param {Function} callback function to execute after fade complete
     */
    function fadeOut ( elem, inc, callback ) {

        var op = 1;  // initial opacity

        var t = setInterval( function () {

            if ( op <= 0.1 ) {

                clearInterval( t );

                // elem is now invisible

                elem.style.display = 'none';

            }

            elem.style.opacity = op;

            // support old IE

            elem.style.filter = 'alpha(opacity=' + op * 100 + ")";

            op -= op * inc;

        }, fadeOutInc );

    };

    /** 
     * Wrapper for setInterval, call function after time delay
     * @param {Number} del time delay, in milliseconds
     * @param {Function} callback the callback function
     */
    function delay ( del, callback ) {

        var t = setInterval( function () {

            callback();

            clearInterval( t );

        }, del );

    }

    /** 
     * Create an alert-style dialog in the DOM.
     * @param {String} className the CSS class
     * @param {Boolean} useButton if true, add a close button
     */
    function createMessage ( className, useButton ) {

        var padding = '';

        counter++;

        if ( counter < 10 ) {

            padding = '0';

        }

        var elem = document.createElement( 'div' );

        elem.id = name + padding + counter;

        elem.className = className || '';

        hideMessage( elem );

        // make container for text and button

        var container = document.createElement( 'div' );

        container.id = elem.id + messageStr;

        // make the message element

        var message = document.createElement( 'span' );

        message.id = elem.id + messageStr;

        container.appendChild( message );

        // optionally add close button

        if ( useButton ) {

            var button = document.createElement( 'button' );

            button.id = elem.id + buttonStr;

            button.innerHTML = 'close';

            button.onclick = function () {

                removeMessage ( elem );

                }

            container.appendChild( button );

        }

        // add to alert

        elem.appendChild( container );

        // invisible by default

        elem.style.display = 'none';

        // save a reference, and return

        messages.push( elem );

        return elem;
    };

    /** 
     * Set the message within an existing alert.
     * @param {DOMElement|String} elem DOM element we want to get.
     * @param {String} msg the message to display.
     * @param {Boolean} showFlag if true, immediately display the message.
     * @param {Boolean} useButton if true, a close button is added to the dialog.
     * @param {String} className the CSS class for the message
     * @param {DOMElement|undefined} if present, use instead of creating a new DOM element
     */
    function setMessage ( msg, showFlag, useButton, className, elem ) {

        if ( ! msg ) {

            console.error( 'domui.setMessage(): failed to specify message')
        }

        // use existing element, or create new one and add to messages.

        elem = getElement( elem );

        if ( ! elem ) {

            elem = createMessage( className, useButton );

            if ( ! elem ) {

                return;

            }

        }

        // find the element in our list

        for ( var i = 0, len = messages.length; i < len; i++ ) {

            // change the element's text

            if ( elem === messages[i] ) {

                elem.childNodes[0].childNodes[0].innerHTML = msg;

                if ( showFlag ) {

                    showMessage( elem );

                }

                return elem;

            }

        }

        console.error ( 'domui.setMessage(): could not find message DOM element');

        return null;

    };

    /** 
     * Show the alert-style dialog with its message.
     * @param {DOMElement|String} elem DOM element we want to get
     * @param {DOMElement|String} overElem the element to position the alert over
     */
    function showMessage ( elem ) {

        if ( ! elem ) {

            console.error( 'domui.showMessage(): failed to specify DOM element');
        }

        // use document.body for centering

        elem = getElement( elem );

        if ( elem ) {

            elem.style.position = 'absolute';

            elem.style.display = 'block';

            var w = 0.8 * getScreenWidth();

            if ( w > 460 ) {

                w = 460;

            }

            elem.style.width = w + 'px';

            // center horizontally and down a bit vertically

            elem.style.left = ( ( getScreenWidth() / 2 ) - ( w / 2 ) ) + 'px';

            elem.style.top = getScreenHeight() * 0.2 + 'px';

            document.body.appendChild( elem );

            return true;

        }

        console.error ( 'domui.setMessage(): could not find message DOM element');

        return false;

    };

    /** 
     * Hide the alert-style dialog with its message.
     * @param {DOMElement} elem the DOM element to hide
     * @param {Function} callback function to execute after fade complete
     * @param {Boolean} fadeFlag if true, fade out slowly
     * @param {Number} inc a number beween 0 and 1 describing fade intervals
     */
    function hideMessage ( elem, callback, fadeFlag, inc ) {

        elem = getElement( elem);

        if ( ! elem ) {

            console.error( 'domui.hideMessage(): failed to specify DOM element')
        }

        elem = getElement( elem );

        if ( elem ) {

            if ( fadeFlag ) {

                if ( inc ) {

                    if (inc > 0.99 ) {

                        console.error( 'domui.hideMessage(): invalid fade increment:' + inc );

                        return;

                    }

                    fadeOut( elem, inc );

                } else {

                    fadeOut( elem, 0.1 );

                }


            } else {

                // no fade

                elem.style.display = 'none';

            }

            return true;

        }

        console.error ( 'domui.setMessage(): could not find message DOM element');

        return false;

    };

    /** 
     * delete a message entirely
     * @param {DOMElement} elem the message element
     */
    function removeMessage ( elem ) {

        if ( ! elem ) {

            console.warn( 'domui.removeMessage(): failed to specify DOM element');

            return;

        }

        elem = getElement( elem );

        if ( elem ) {

            // remove reference from DOM

            elem.parentNode.removeChild( elem );

            // remove reference from our list

            for ( var i = 0, len = messages.length; i < len; i++ ) {

                if (messages[i] === elem || messages[i].id === elem ) {

                    messages[i] = null;

                    messages.splice(i, 1);

                }

            }

        }

    }

    /** 
     * Create a Progress dialog, with fallback to text-style presentation. It 
     * creates a container with a <div> for text status, a <progress> bar for 
     * visual readout, and additional text for browsers that don't support the 
     * <progress> element.
     * @param {String} className the className CSS class to apply to the element
     * @param {String} containerClassName the className for the container element
     * @param {Number} value the current value of the <progress>
     * @param {Number} max the max value of the <progress>
     * @param {DOMElement} parent optional specified for <progress> parent
     */
    function createProgress ( containerClassName, className, value, max, parent ) {

        // Create unique ID

        var padding = '';

        counter++;

        if ( counter < 10 ) {

            padding = '0';

        }

        // Create a container forming a DOM alert

        var container = document.createElement( 'div' );

        container.id = name + counter + progressStr + containerStr;

        container.className = containerClassName || '';

        container.style.display = 'block';

        // Text readout above <progress> bar

        var progText = document.createElement( 'div' );

        progText.innerHTML = ' . ';

        // Create <progress> within the container

        var progElem = document.createElement( 'progress' );

        progElem.id = name + counter + progressStr;

        progElem.className = className || '';

        progElem.value = value || 0;

        progElem.max = max || 100;

        // Seen only if <progress> not supported by the browser

        progElem.innerHTML = '<span>0</span>%';

        container.appendChild( progText );

        container.appendChild( progElem );

        parent = parent || document.body;

        parent.appendChild( container );

        container.parentNode = parent;

        return progElem;

    };

    /** 
     * Update the progress dialog, using local scope 'that', since 
     * we are likely to be in a callback.
     * @param {DOMElement} the DOM <progress> element, or its Id value (not its wrapper)
     * @param {Number} percent (value between 0-100)
     * @param {String} msg additional message
     */
    function updateProgress ( progElem, percent, msg ) {

        msg = msg || '';

        progElem = getElement( progElem );

        if ( ! progElem ) {

            console.error( 'domui.updateProgress() error: <progress> element not provided.' );

            return;

        }

        if ( isNaN( percent ) ) {

            console.error( 'domui.updateProgress() error: supplied % value:' + percent + ' is not a number.');

            return;

        }

        console.log( 'progress function, ' + percent + '%' + ' for:' + msg );


        // Handle non-<progress> tags

        if ( progElem.tagName.toUpperCase() === 'PROGRESS' ) {

            // get the text element in its enclosing <div>

            progElem.parentNode.getElementsByTagName( 'div' )[0].innerHTML = msg;

            // set the <progress> element

            progElem.value = percent;

        } else { // text fallback

            progElem.getElementsByTagName( 'span' )[0].innerHTML = percent;

        }

    };

    /** 
     * Hide and remove the progress dialog, using a supplied DOM element 
     * containing the <progress> bar. 
     * @param {DOMElement|String} the DOM <progress> element, or its Id value (not its wrapper)
     * falls back to inserting equivalent text.
     */
    function hideProgress ( progElem ) {

        progElem = getElement( progElem );

        if ( ! progElem ) {

            console.warn( 'domui.hideProgress() error: <progress> element not provided' );

            return;

        }

        var container = progElem.parentNode;

        // set to final value for consistency

        progElem.value = 100;

        progElem.getElementsByTagName('span')[0].innerHTML = '100%';

        // remove it via removing its parent

        container.style.display = 'none';

        container.parentNode.removeChild( container );

        progElem = container = null;

    };

    /** 
     * Set <progress> to complete, fade out
     */
    function finishProgress ( progElem ) {

        // Leave up for a bit, then fade out

        delay( 500, function () {

            // Hide the message with fading, remove when invisible

            fadeOut ( progElem.parentNode, 0.1, function () {

                hideProgress( progElem );

            } );

        } );

    };

    /** 
     * Post a non-fatal warning to the user
     * @param {String} msg the message to display
     * @param {String} className apply CSS styles to alert
     */
    function browserWarn ( msg, className ) {

        // Hide any active <progress>

        hideProgress();

        // show a message (without a close button)

        var elem = setMessage( msg, true, false, className );

        showMessage( elem );

        // keep message onscreen for value shown in the delay

        delay( 4000, function () {

            // hide the message with fading, remove when invisible

            hideMessage( elem, removeMessage, true, 0.1 );

        } );

    };

    /** 
     * What to do when we can't load HTML5 canvas, 
     * 3d libraries, or WebVR.
     * @param {String} msg the message to show on failure.
     * @param {String} imgPath path to the replacement image
     * @param {String} className apply CSS styles to alert
     * @param {DOMElement} container if the <canvas> is created dynamically, supply 
     * another DOMElement to append the "fail image" to.
     */
    function browserFail ( msg, imgPath, className , container ) {

        replaceCanvasWithImage( imgPath, container );

        browserWarn( msg, className );

        /*

        // Hide any active <progress>

        hideProgress();

        var elem = setMessage( msg, true, true, className );

        showMessage( elem );

        // show message for value shown in the delay

        delay( 2000, function () {

            // hide the message with fading, remove when invisible

            hideMessage( elem, removeMessage, true, 0.1 );

        } );

        */

    };

    /** 
     * Create buttons controling fullscreen and VR
     * The control panel is a top horizontal header with 
     * identity plus Ui buttons for entering fullscreen, VR 
     * and re-setting pose
     * @param {DOMElemen} parentElem the parent element on the page, if specified
     * @param {String} panelClass the CSS class for styling the panel
     */
    function createControlPanel ( text, panelClass, textClass, buttonClass, linkClass ) {

        if( controlPanel ) {

            console.warn( 'domui.createControlPanel() warning: button container already created' );

            return;

        }

        controlPanel = document.createElement( 'div' );

        if ( controlPanel ) {

            controlPanel.className = panelClass;

        }

        textContainer = document.createElement( 'div' );

        textContainer.className = textClass || '';

        textContainer.innerHTML = text;

        buttonContainer = document.createElement( 'div' );

        buttonContainer.className = buttonClass || '';

        linkContainer = document.createElement( 'div' );

        linkContainer.className = linkClass || '';

        // Adjust the buttonContainer to enclose the created button

        var b = document.createElement('button');

        // CSS styles
        b.className = buttonClass;

        // Dynamic styles.
        buttonContainer.style.height = getComputedStyle(b).getPropertyValue('height');

        b = null;

        // Add to the container (holds buttons and canvas)

        controlPanel.appendChild( textContainer );

        controlPanel.appendChild( buttonContainer );

        controlPanel.appendChild( linkContainer );

        document.body.insertBefore( controlPanel, document.body.childNodes[0] );

        return controlPanel;

    };

    /** 
     * Create an individual button for the control panel
     * @param {DOMElement} container the container for buttons in the Ui
     * @param String text the button text.
     * @param Function clickHandler the function handling button clicks.
     * @param String buttonClass the CSS className for the button.
     */
    function addControlButton ( text, clickHandler, buttonClass ) {

        if ( ! buttonContainer) {

            console.error( 'domui.addButton(): button container not initialized' );

            return;
 
        }

        if ( ! text ) {

            console.error( 'domui.addControlButton() error: no button text supplied.');

            return;

        }

        // Create the button

        var button = document.createElement( 'button' );

        button.innerHTML = text;

        button.className = buttonClass || '';

        // Add the event handler

        if (typeof clickHandler == 'function') {

            button.addEventListener( 'click', clickHandler );

        } else {

            button.disabled = true;

        }

        buttonContainer.appendChild(button);

        return button;

    };

    /**
     * Define a hyperlink in the control panel
     */
    function addControlLink ( text, url, linkClass ) {

        if ( ! linkContainer ) {
            
            console.error( 'domui.addControlLink() error: link container not created.');

            return;

        }

        if ( ! text || ! url ) {

            console.error( 'domui.addControlLink() error: no text or link supplied.');

            return;

        }

        var link = document.createElement( 'a' );

        link.innerHTML = text;

        link.href = url;

        link.className = linkClass || '';

        linkContainer.appendChild( link );

        return link;

    };

    /** 
     * Show the Ui buttons
     */
    function showControlPanel () {

        controlPanel.style.display = 'block';

    };

    /** 
     * Hide the Ui buttons
     */
    function hideControlPanel () {

        controlPanel.style.display = 'none';

    };

    /** 
     * Set up listening for fullscreen requests. Initially 
     * it may be null, so check for the event being undefined
     */
    function listenFullscreen ( fullscreenChangeFn ) {

        // NOTE: put w3c ahead of others, since they may be non-functional but still available

        if ( 'onfullscreenchange' in document ) {

            document.addEventListener( 'fullscreenchange', fullscreenChangeFn, false );

        } else if ( 'onwebkitfullscreenchange' in document ) {

            document.addEventListener( 'webkitfullscreenchange', fullscreenChangeFn, false );

        } else if ( 'onmozfullscreenchange' in document ) {

            document.addEventListener( 'mozfullscreenchange', fullscreenChangeFn, false );

        } else if ( 'onMSFullscreenChange' in document ) {

            document.addEventListener( 'MSFullscreenChange', fullscreenChangeFn, false );

        }

    };

    /** 
     * Request fullScreen using vendor prefixes.
     * @param {DOMElement} elem the element to set fullscreen.
     * @param {Boolean} controlFlag if true, hide the controls.
     */
    function enterFullscreen ( elem, controlFlag ) {

        // hide the control panel

        if ( controlFlag ) {

            hideControlPanel();

        }

        // handle vendor prefixes

        if ( elem.requestFullscreen ) {

            elem.requestFullscreen();

            return true;

        } else if ( elem.mozRequestFullscreen ) {

            elem.mozRequestFullscreen();

            return true;

        } else if ( elem.webkitRequestFullscreen ) {

            elem.webkitRequestFullscreen();

            return true;

        } else if ( elem.msRequestFullscreen ) {

            elem.msRequestFullscreen();

            return true;

        }

        return false;

    };

    /** 
     * browser fix for checking if we are in fullscreen
     */
    function isFullscreen () {

       return document.fullscreenElement || document.webkitFullscreenElement || 
            document.mozFullScreenElement || document.msFullscreenElement || 
            document.webkitCurrentFullScreenElement || 
            ( ! window.screenTop && ! window.screenY ) || false;

    };

    /** 
     * manually leave fullscreen. In the Fullscreen API, the 
     * escape key automatically leaves, and generates an 
     * onfullscreen change. Manually leaving fullscreen with 
     * a Ui control requires firing the exitFullscreen() function.
     */
    function exitFullscreen () {

        if ( document.exitFullscreen ) {

            document.exitFullscreen();

        } else if ( document.webkitExitFullscreen ) {

            document.webkitExitFullscreen();

        } else if ( document.webkitCancelFullScreen ) {

            document.webkitCancelFullScreen();

        } else if ( document.mozCancelFullScreen ) {

            document.mozCancelFullScreen();

        } else if ( document.msExitFullscreen ) {

            document.msExitFullscreen();

        }

        // Restore the Ui

       showControlPanel();

    };

    // CSS pseudo-fullscreen styles
    var cssProperties = [
      'position: absolute',
      'top: 0',
      'left: 0',
      'width: ' + Math.max(screen.width, screen.height) + 'px',
      'height: ' + Math.min(screen.height, screen.width) + 'px',
      'border: 0',
      'margin: 0',
      'padding: 0 10px 10px 0',
    ];

    // CSS storage for default DOM properties
    var cssDOMProperties = [

    ];

    /* 
     * Get the current CSS properties of a CSS element (to restore later)
     * @param {DOMElement} elem the DOM element we want to get properties for
     */
    function getCSSProperties ( elem ) {

        cssDOMProperties = []; //re-entrant

        cssDOMProperties.push ( 'position:' + getComputedStyle( elem, null ).getPropertyValue('position'));
        cssDOMProperties.push ( 'top:' + getComputedStyle( elem, null ).getPropertyValue('top'));
        cssDOMProperties.push ( 'left:' + getComputedStyle( elem, null ).getPropertyValue('left'));
        cssDOMProperties.push ( 'width:' + getComputedStyle( elem, null ).getPropertyValue('width'));
        cssDOMProperties.push ( 'height:' + getComputedStyle( elem, null ).getPropertyValue('height'));
        cssDOMProperties.push ( 'border:' + getComputedStyle( elem, null ).getPropertyValue('border'));
        cssDOMProperties.push ( 'margin:' + getComputedStyle( elem, null ).getPropertyValue('margin'));
        cssDOMProperties.push ( 'padding:' + getComputedStyle( elem, null ).getPropertyValue('padding'));
        return cssDOMProperties;
    };

    /** 
     * If we can't go go fullscreen, set our CSS to mimic fullscreen.
     * @param {DOMElement} elem the DOM element we want to get properties for
     */
    function mobileEnterFullscreen ( elem ) {

        // save our current CSS styles
        getCSSProperties ( elem );

        // apply fullscreen styles
        elem.setAttribute('style', cssProperties.join('; ') + ';');

        webkitCSSPatch( canvas );

    };

    /** 
     * Check if our mobile is 'fullscreen-like'. If we are fullscreen on a non-mobile device, 
     * it will also return true
     * @param {DOMElement} elem the DOM element we want to get properties for
     */
    function mobileIsFullscreen ( elem ) {

        if ( parseInt( getComputedStyle( elem, null ).getPropertyValue( 'width') )  >= Math.max(screen.width, screen.height ) && 
            parseInt( getComputedStyle( elem, null ).getPropertyValue( 'width') )  >= Math.max(screen.width, screen.height) ) {

            return true;

        } 

        return false;

    };

    /** 
     * Exit pseudo-fullscreen mode on mobile
     * @param {DOMElement} elem the DOM element we want to get properties for
     */
    function mobileExitFullscreen ( elem ) {

        elem.setAttribute('style', cssDOMProperties.join( '; ' ) + ';');

    };


    /** 
     * fix safari fullscreen bug
     * Adapted from WebVR-Polyfill
     * @link https://github.com/borismus/webvr-polyfill
     * iOS only workaround
     * @link https://bugs.webkit.org/show_bug.cgi?id=152556
     * @param {}
     */
    function webkitCSSPatch ( canvas ) {

        var width = canvas.style.width;

        var height = canvas.style.height;

        canvas.style.width = ( parseInt(width) + 1 ) + 'px';

        canvas.style.height = ( parseInt( height ) ) + 'px';

        console.log( 'Resetting width to...', width );

        setTimeout( function() {

            console.log( 'Done. Width is now', width );

            canvas.style.width = width;

            canvas.style.height = height;

        }, 100 );

    };


    return {

        replaceCanvasWithImage: replaceCanvasWithImage,

        browserFail: browserFail,

        browserWarn: browserWarn,

        createProgress: createProgress,

        updateProgress: updateProgress,

        finishProgress: finishProgress,

        hideProgress: hideProgress,

        createControlPanel: createControlPanel,

        addControlButton: addControlButton,

        addControlLink: addControlLink,

        showControlPanel: showControlPanel,

        hideControlPanel: hideControlPanel,

        listenFullscreen: listenFullscreen,

        enterFullscreen: enterFullscreen,

        isFullscreen: isFullscreen,

        exitFullscreen: exitFullscreen,

        mobileEnterFullscreen: mobileEnterFullscreen,

        mobileIsFullscreen: mobileIsFullscreen,

        mobileExitFullscreen: mobileExitFullscreen

    };

} )();