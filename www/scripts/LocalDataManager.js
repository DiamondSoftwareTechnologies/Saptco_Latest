/**
 * 
 * 
 * $.getScript("js/jquery.cookie.js", function() {
 * 
 * });
 */
function SaveLocalData(key, value)
{
    if (typeof (Storage) !== "undefined")
    {
        // Store
        localStorage.setItem(key, value);

    }
    else
    {
        alert("Sorry, your Device does not support Web Storage...");
    }
}

function GetLocalData(key)
{
    if (typeof (Storage) !== "undefined")
    {
        // Retrieve
        return localStorage.getItem(key);
    }
    else
    {
        alert("Sorry, your Device does not support Web Storage...");
        return "";
    }

}

function GetLocalDataObject(key)
{
    if (typeof (Storage) !== "undefined")
    {

        // Retrieve
        var itemValue = localStorage.getItem(key);
        if (itemValue != "undefined" && itemValue != null && itemValue != "null")
        {
            try
            {
                return JSON.parse(localStorage.getItem(key));
            }
            catch (e)
            {
                return null;
            }
        }
        else
        {
            return null;
        }
    }
    else
    {
        alert("Sorry, your Device does not support Web Storage...");
        return "";
    }
}
function GetDescriptionByLanguage(arabicDescription, englishDescription) {
    if (GetApplicationLanguage() == "en") {
        return englishDescription;
    } else {
        return arabicDescription;
    }
}
function SaveLocalObject(key, value)
{
    if (typeof (Storage) !== "undefined")
    {
        // Store
        localStorage.setItem(key, JSON.stringify(value));

    }
    else
    {
        alert("Sorry, your Device does not support Web Storage...");
    }
}

function DeleteLocalData(key)
{
    localStorage.setItem(key, null);
}