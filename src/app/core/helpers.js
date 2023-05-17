module.exports = {
    returnRegXResult: function (regStart, regEnd, string) {
        const regex = new RegExp('(?<=' + regStart + ')([\\s\\S]*?)(?=' + regEnd + ')');
        const checkResponse = regex.test(string);

        if(checkResponse) {
            // remove array from output in json
            return string.match(regex)[0];
        } 

        return null;
    },

    returnNumericValue: function (string) {
        const numericRX = /[-]{0,1}[\d]*[.]{0,1}[\d]+/g;
        const checkResponseHasNumericValue = numericRX.test(string);

        if(checkResponseHasNumericValue) {
            // change string to numeric value
            return +string.match(numericRX)[0];
        } 

        return null;
    },

    removeHTMLtags: function (string) {
        return string.replace(/<[^>]*>?/gm, ' ').replace(/\s{2,}/g, ' ');
    },

    sortDescending: function (values, property) {
        return values.sort((a, b) => (a[property] < b[property] ? 1 : -1));
    }
}