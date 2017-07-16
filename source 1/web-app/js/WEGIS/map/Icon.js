Ext.define('WEGIS.map.Icon', {
    singleton: true,
    location: new OpenLayers.Icon("../images/WEGIS/MapIcon/map_Location.png", new OpenLayers.Size(39, 47), new OpenLayers.Pixel(-15, -47)),
    org: {
        width: 20,
        height: 27,
        url: {
            NP100_1: "../images/WEGIS/OrgIcon/NP100-1.png",
            NP100_2: "../images/WEGIS/OrgIcon/NP100-2.png",
            NP100_3: "../images/WEGIS/OrgIcon/NP100-3.png",
            NP200: "../images/WEGIS/OrgIcon/NP200.png",
            NP300: "../images/WEGIS/OrgIcon/NP300.png",
            NP400: "../images/WEGIS/OrgIcon/NP400.png",
            NP500: "../images/WEGIS/OrgIcon/NP500.png",
            NP600: "../images/WEGIS/OrgIcon/NP600.png",
            NP700: "../images/WEGIS/OrgIcon/NP700.png",
            default: "../images/WEGIS/OrgIcon/default.png"
        }
    },
    getOrgIcon: function(type){
        var me = this;

        var width = me.org.width;
        var height = me.org.height;
        var offsetWidth = -(width / 2);
        var offsetHeight = -height;

        var iconUrl = me.getOrgIconUrl(type);
        var icon = new OpenLayers.Icon(iconUrl, new OpenLayers.Size(width, height), new OpenLayers.Pixel(offsetWidth, offsetHeight));

        return icon;
    },

    getOrgIconUrl: function(type){
        var me = this;

        var iconUrl;
        switch(type){
            case 'NP100-1':
                iconUrl = me.org.url.NP100_1;
                break;
            case 'NP100-2':
                iconUrl = me.org.url.NP100_2;
                break;
            case 'NP100-3':
                iconUrl = me.org.url.NP100_3;
                break;
            case 'NP200':
                iconUrl = me.org.url.NP200;
                break;
            case 'NP300':
                iconUrl = me.org.url.NP300;
                break;
            case 'NP400':
                iconUrl = me.org.url.NP400;
                break;
            case 'NP500':
                iconUrl = me.org.url.NP500;
                break;
            case 'NP600':
                iconUrl = me.org.url.NP600;
                break;
            case 'NP700':
                iconUrl = me.org.url.NP700;
                break;
            default:
                iconUrl = me.org.url.default;
                break;
        }

        return iconUrl;
    }
});