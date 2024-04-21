function TitleName(text) {
    const trimmedText = text.replace(/ /g, " ");
  
    return trimmedText.replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());
}
module.exports = TitleName