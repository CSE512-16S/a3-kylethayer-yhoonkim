Assignment3
===============

## Team Members

1. Kyle Thayer
2. Younghoon Kim

## Color Translater

![Thumbnail](thumbnail.png)

Color Translater presents the translation of colornames in different language through color map. 
Through the cycle of translating, we'd like users you to explore the color-colorname-language space!

We collected the dataset from the Amazon Mechanical Turk during CSE510 course project. The dataset is composed of columns like the below.

- color code in R,G,B
- colorname 
- language


## Running Instructions

Access our visualization at http://cse512-16s.github.io/a3-kylethayer-yhoonkim/, or download this repository and run `python -m SimpleHTTPServer 9000` and access this from http://localhost:9000/.

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

In the storyboard, we attempted to present the regions by drawing their border(the first of the belows) but when we did so, it was very hard to intepret, both because it was too blocky, and also because our data was sparse and had holes in it:
<img src="storyboard/mapOriginal.png" width="960">

Even when we tried to increase the resolution of the Self-Organizing Map, the holes in our data still made it too hard to read:
<img src="storyboard/map1.5.jpg" width="480">

At this point we either needed to get more data, find a way of cleanin our data or trying a different visualization.

Our next attempt was to use size of the rectangles used to display the nodes. Full size is when both selected color names were used for a color, mid-size is when only one of the two was used, and small for when neight color name was used for a color:
<img src="storyboard/map1.jpg" width="480">

We thought this was the best looking of all our visualizations, but it required interaction to discover which of the two color terms applied to the mid-size color tiles.

Next we tried adding vertical or horizontal direction to the mid-size tiles to show which color term went with it:
<img src="storyboard/map4.jpg" widtht="480">

The reason we rejected this one was because it was hard to visually group together the squares with either the verticle or horizontal rectangles. 

Next we tried variations of verticle and horizontal rectangles an crosses for when both names applied.
<img src="storyboard/map2.jpg" width="480">
<img src="storyboard/map3.jpg" widtht="480">

These worked better. We could visually group each term's area separately and see the overlap, but we felt there was too much lost with all the white space.

We ended up settling on using horizintal and verticle lines overlayed on the color map.
<img src="storyboard/hatched.jpg" widtht="800">

These lines highlight color areas and are fairly easy to find against light colors, though they can fail to show up against dark colors. We had trouble deciding what to do since sometimes our map has both bright and dark colors at the same time. The lines do obscure the color they highlight some, changing how dark they look, but almost all means of highlighting colors had some problem with changing the appearance of the colors to some extent. 

One possibility for future consideration would be to go back to the simply sized squares, but use two displays of the same Self-Organizing Map, one for each color term. This would probably be more visually pleasing, but it would be challenging to directly observer smaller differences between color name borders.


## Development Process

Include:
- Breakdown of how the work was split among the group members.
- A commentary on the development process, including answers to the following questions:
  - Roughly how much time did you spend developing your application?
  - What aspects took the most time?
