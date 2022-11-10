import Application from './components/Application';
//import Define from 'define';
import React from 'react';
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define('admin/plugins/twitch-monitor', [], () => {
    return {
        init: function () {
            React.render(
                <Application />,
                document.getElementById('acpTwitchMonitor')
            );
        }
    };
});
