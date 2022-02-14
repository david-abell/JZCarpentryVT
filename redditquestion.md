So I've been building a simple 3 page website in html css and vanilla JS for a family member as a way to teach myself web development after working through the FCC curriculum a while back . Its a nice, meaningful project that's allowed me to learn necessary skills and replaces a currently used wordpress sight. The project is currently built with Parcel 2 using a few npm packages and deployed to netlify. I've also integrated into netlify's forms api.

I'd like to add some sort of templating or static site generation to the gallery page and link this to a cms with some image processing code => image returns [thumbnail, mobile scaled image, large desktop image] so the gallery can be automatically rebuilt from a the media folder contents when new images/deletions occur.

Basically just some sort of foreach to insert something like below into that gallery.html

```
     <div class="gallery" id="gallery">
        <a
        class="gallery-item glightbox"
        href="./images/gallery/spc001.webp"
        data-sizes="(max-width: 600px) 480px, 800px"
        data-srcset="img480.jpx 480w img800.jpg 800w"
        >
        <img
        class="lozad"
        data-src="images/gallery/thumbs/spc001-thumb.webp"
        alt=""
         />
        </a>
        <a
        class="gallery-item glightbox"
        href="./images/gallery/living-work-spaces/spc002.webp"
        data-sizes="(max-width: 600px) 480px, 800px"
        data-srcset="img480.jpx 480w img800.jpg 800w"
        >
        <img
        class="lozad"
        data-src="images/gallery/living-work-spaces/thumbs/spc002-thumb.webp"
        alt=""
        />
        </a>
    </div>
```

I'm looking for recommendations on how I might best approach this. Most of the site is already built static so I do not need to build all the pages, just to supplement the gallery. No formatting or anything needed, just the html generation.

I haven't used any templating or static sight generation yet and there seem to be a ton of options out there. What technologies have you had luck with or like for this sort of use case?

Thanks!
