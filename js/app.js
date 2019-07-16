function prepareDownload(allDownloads) {
  allDownloads.forEach(file => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', e => prepareImage(e, file.name));
  });
}

function prepareImage(e, fileName) {
  const img = document.createElement('img');
  img.src = e.target ? e.target.result : e;
  img.addEventListener('load', e => setImageSize(e, fileName));
}

function setImageSize(e, fileName) {
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');
  const img = e.target;
  const reSize = percentage.value / 100;
  c.width = img.width * reSize;
  c.height = img.height * reSize;
  ctx.drawImage(img, 0, 0, c.width, c.height);
  c.toBlob(image => downloadImage(image, fileName), 'image/jpeg', 1);
}

function downloadImage(image, fileName) {
  const a = document.createElement('a');
  image = URL.createObjectURL(image);
  a.href = image;
  a.download = fileName;
  if (isNewPercentage) a.click();
  images.appendChild(a);
  fillAnchor({
    fileName,
    image,
    a
  });
}

function fillAnchor({
  fileName,
  image,
  a
}) {
  const preview = document.createElement('img');
  const name = document.createElement('i');
  preview.src = image;
  name.innerText = fileName.split('-').join(' ');
  a.appendChild(preview);
  a.appendChild(name);
}

function all() {
  const elements = [...document.querySelectorAll('[hide]')];
  return {
    show() {
      elements.forEach(hide =>
        hide.setAttribute('hide', 'false')
      );
    },
    hide() {
      elements.forEach(hide =>
        hide.setAttribute('hide', 'true')
      );
    }
  }
}

const images = document.getElementById('images');
const download = document.getElementById('download');
const upload = document.getElementById('upload');
const percentage = document.getElementById('percentage');
let currentPercentage = percentage.value;
let isNewPercentage;

upload.addEventListener('input', e => {
  images.innerHTML = '';
  document.querySelector('[for="upload"] span').innerText = 'más';
  all().show();
  prepareDownload([...e.target.files]);
});

download.addEventListener('click', e => {
  const downloads = [...images.querySelectorAll('a')];
  isNewPercentage = currentPercentage !== percentage.value;
  if (isNewPercentage) {
    const files = [...upload.files];
    images.innerHTML = '';
    prepareDownload(files);
  } else downloads.forEach(d => d.click());
});