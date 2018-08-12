# Yunmai M1501 graphs

I have a cheap (NZD$50) set of Bluetooth scales. They interact with a mobile
app via Bluetooth. I'm using the data they gather to learn D3 and see more
interesting graphs.

This started because one of my sons measured himself while my data profile was
selected, and the delete function in the app doesn't work. So I either had to
look at outlandish spikes in my graph, or extract the data & roll my own graphs.

## Q: I want to do the same!

You should check out [conoro/yunmai-data-extract](https://github.com/conoro/yunmai-data-extract) instead 😁

## Questions

* What is "Plump"? Currently I'm "+0.4% Plump" in the Android app. Negative values of plump occur.
* What is the "missing" component of bone/muscle/fat/... breakdown? Offal?

## TODO

* Write up a blog post about how this works.
* Load in data dynamically (switch user)
* Average weight by day, week
* Switch between measurement / day / week etc
* Stack bone / muscle / fat
* Understand how bone / muscle / fat / ...? should sum
* Space labels nicely so they don't overlap
