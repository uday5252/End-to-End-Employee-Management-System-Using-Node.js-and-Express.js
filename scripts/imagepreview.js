const imageFilePicker = document.getElementById("image")
const futureImage = document.getElementById("preview")

imageFilePicker.addEventListener("change", function()
{
    //This function executes automatically when some change is encountered
    //File is selected by the user
    // Lets get that file name

    const reader = new FileReader()
    reader.onload = function(event)
    {
        console.log(event)
    }

    let fileData = imageFilePicker.files//details of the files which are selected
    futureImage.src = `images/${fileData[0].name}`//firstemployee.png
})

// <input type="file" accept="image/*" onchange="previewImage(event)">

// function previewImage(event) {
//     var input = event.target;
//     var image = document.getElementById('preview');
//     if (input.files && input.files[0]) {
//        var reader = new FileReader();
//        reader.onload = function(e) {
//           image.src = e.target.result;
//        }
//        reader.readAsDataURL(input.files[0]);
//     }
//  }