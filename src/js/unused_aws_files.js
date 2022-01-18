// //////////////////////////////////////////
// //////////contact form dropzone///////////
// //////////////////////////////////////////

// Dropzone.autoDiscover = false;

// prevent undifined variables by declaring dropzone only on contact page
// let previewZone;
// let myDropzone;
// let contactForm;

// if (document.querySelector("#drop-area")) {
//   contactForm = document.querySelector("#contact-form");
//   myDropzone = new Dropzone("#drop-area", {
//     // url: "contact.html",
//     url: "https://5xd90nuti9.execute-api.eu-west-1.amazonaws.com/development/multipart",
//     headers: {
//       "Cache-Control": null,
//       "X-Requested-With": null,
//     },
//     paramName: "files",
//     autoProcessQueue: false,
//     uploadMultiple: true,
//     parallelUploads: 100,
//     maxFiles: 100,
//     maxFilesize: 6, // MB
//     dictDefaultMessage: "To upload files, click or drag and drop here",
//     // transformFile: function(file, done) {

//     // },
//     init: function () {
//       const submitAll = document.querySelector("#submit-all");
//       // tell Dropzone to process file queue.
//       submitAll.addEventListener("click", function (e) {
//         e.preventDefault();
//         e.stopPropagation();
//         console.log(myDropzone);
//         myDropzone.processQueue();
//       });

//       var myDropzone = this;
//       this.on("addedfile", function (file) {
//         file.previewElement.addEventListener("click", function () {
//           myDropzone.removeFile(file);
//         });
//       });

//       // Listen to the sendingmultiple event. In this case, it's the sendingmultiple event instead
//       // of the sending event because uploadMultiple is set to true.
//       this.on("sendingmultiple", function (files, xhr, formData) {
//         // Gets triggered when the form is actually being sent.
//         // Attach form inputs to transmitting form data
//         const contactData = new FormData(contactForm);
//         const data = {
//           firstName: contactData.get("submitted-first-name"),
//           lastName: contactData.get("submitted-last-name"),
//           email: contactData.get("submitted-email"),
//           message: contactData.get("submitted-description"),
//           "g-recaptcha-response": grecaptcha.getResponse(),
//         };
//         // myDropzone.options.params.body = data;
//         // formData.append("body", data)
//         for (let key in data) {
//           formData.append(key, data[key]);
//         }
//         console.log(Array.from(formData.entries()));
//         console.log(files);
//         // console.log(Array.from(contactData))

//         // Hide the success button or the complete form.
//       });
//       this.on("successmultiple", function (files, response) {
//         // Gets triggered when the files have successfully been sent.
//         // Redirect user or notify of success.
//         console.log(response.message);
//       });
//       this.on("errormultiple", function (files, response) {
//         // Gets triggered when there was an error sending the files.
//         // Maybe show form again, and notify user of error
//         console.error("error:", response.message);
//       });
//     },
//   });
// }

// still to be combined with dropzone
// const form = document.getElementById("form");
//     form.addEventListener("submit", submitForm, true);

//     function submitForm(event) {
//       event.preventDefault();

//       // const formData = new FormData(form);
//       // const data = {
//       //   firstName: formData.get("firstName"),
//       //   lastName: formData.get("lastName"),
//       //   email: formData.get("email"),
//       //   message: formData.get("message"),
//       //   recaptcha: grecaptcha.getResponse(),
//       // };
//       // console.log(Array.from(formData));

//       fetch(
//         "https://5xd90nuti9.execute-api.eu-west-1.amazonaws.com/development/multipart",
//         {
//           method: "POST",
//           mode: "cors",
//           body: new FormData(form),
//           // body: JSON.stringify(data),
//           // headers: {
//           //   Accept: "multipart/form-data",
//           //   "Content-Type": "multipart/form-data",
//           // },
//           // credentials: "same-origin",
//         }
//       ).then(
//         function (response) {
//           console.log(response.statusText);
//         },
//         function (error) {
//           console.error("Error:", error.message);
//         }
//       );
//     }
