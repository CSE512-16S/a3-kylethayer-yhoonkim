Assignment3
===============

## Team Members

1. Kyle Thayer
2. Younghoon Kim


## Color Translater

![Thumbnail](thumbnail.png)

(Put your a brief description of your final interactive visualization application and your dataset here.)


## Running Instructions

Put your running instructions here. (Tell us how to run your visualization.)

If your visualization is web-based,  it would be great if your submission can be opened online. [Github Pages](http://pages.github.com/) is a good and easy way to put your visualization online so you can put your link here.  For example:

Access our visualization at http://cse512-16s.github.io/a3-jheer-mcorrell-jhoffs/ or download this repository and run `python -m SimpleHTTPServer 9000` and access this from http://localhost:9000/.

If you put your work online, please also write a [one-line description and add a link to your final work](http://note.io/1n3u46s) so people can access it directly from the CSE512-16S page.

## Story Board

We considered three stories of using Color Translater.

1. Translate a colorname in another language.
2. See what color a colorname indicates 
3. Compare two colornames by their corresponding colors.  
4. Explore the color-colorname-language space.

To address these stories, we suggested the interface like the below.
![interface](storyboard/interface_overview.png)


#### 1. Translate a color in another language.

- Pick a colorname's language to translate from left language dropdown box (the upper left one).
- Pick the colorname from left colorname dropdown box (the bottom left one).
- Pick a language to translate in from right language dropdown box (the upper right one).
- Then, translated colornames will be shown under the right colorname dropdown boxes in the decending order of similarity.

#### 2. See what color a colorname indicates.

- Pick a colorname's language to translate from left language dropdown box (the upper left one).
- Pick the colorname from left colorname dropdown box (the bottom left one).
- Then, a corresponding color region will be shown on the color map.

#### 3. Compare two colornames by their corresponding colors.

- Pick first colorname, and its language from left dropdown boxes.
- Check "lock" checkbox to lock the colorname.
- Pick second colorname, and its language from right dropdown boxes.
- Then, two corresponding color regions will be shown on the color map.

#### 4. Explore the color-colorname-language space.

- Users can see the color regions of the translated colornames on the map by hovering their mouse cursor.
- Iteratively doing #1,#2, and #3, user can explore the color-colorname-language space.


(*For all four stories, User also can do the same things starting from right dropboxes.*)

We choose the dropdown boxes for interaction methodes because the types of "language" and "colorname" in our dataset are nominal. One of other design choices was using keyboard as interaction input like NameVoyager. It could give more freedom and easy access to explore the languages and colornames. But we set this as a stretch-goal in order to meet the schedule. 

'Lock' checkboxes are for fixing the selected items of the dropboxes. We want to translate the selected colorname instantly, while enabling people to compare arbitary two colors. So we brainstormed possible UIs for controling the mode (auto translation mode / comparing mode) of ColorTranslater (like the below). And we decided to provide lock checkbox due to its' simplicity.

<img src="storyboard/interface_candidates.jpg" height="480">



### Changes between Storyboard and the Final Implementation

A paragraph explaining changes between the storyboard and the final implementation.


## Development Process

Include:
- Breakdown of how the work was split among the group members.
- A commentary on the development process, including answers to the following questions:
  - Roughly how much time did you spend developing your application?
  - What aspects took the most time?
