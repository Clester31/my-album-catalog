# Introduction

Welcome to My Album Catalog - A website for music fans to create, share, and customize their own music listening catalogs. For the last four years, I have been maintaining a thorough catalog of every album that I have listened to since the start of college using a spreadsheet. This gave me the inspiration to create an app where music enthusiasts can easily create extensive catalogs to not only rate albums, but also write short reviews, rate individual tracks, and sort items using a variety of filters. Using Last.FM's API, user's have access to the discographies of thousands of artists, making it perfect for those who listen to many, or only a few albums

You can try out the app [here](https://my-album-catalog-uybe-6y52b4rmh-clester31s-projects.vercel.app/) and check out an example cataog [here](https://my-album-catalog-uybe-6y52b4rmh-clester31s-projects.vercel.app/view/c63e1e54-5198-4552-933b-0562c637a8bb)

# Features

### Album Search

* Search for albums using the search bar on the right side of the page
* Uses Last.FM's API for fetching albums based on search query
* Selecting an album in the search results will prompt the user to enter an album rating, a catalog date, and optional track ratings and review
* Can be collapsed using far left arrow button

### Catalog

* Users can view existing catalogs and create new ones
* Items can be filtered based off certain criteria (A-Z, rating, date, etc.)
* Users can also view their albums in a year-by-year format, with albums separated into different sections for the month they were listened to
* Can toggle a standalone view, which will only show the catalog section with editing permissions disabled

# Tech Stack

* Frontend created using React, Next.JS, and Tailwind
* Backend set up using Firebase Authentication and Firestore

# TODO

* Improve user autherntication (OAuth, ect.)
* User profiles where catalogs can be shown off
* Site-wide album ratings that are updated when a user catalogs/rates an album
