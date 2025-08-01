# Usage

## Using Lua Scripts with Assembly

Welcome to the official guide on how to use Lua scripts with Assembly. All Lua scripts should be located in the following directory on your system:

```
C:\Users\USER\AppData\Roaming\Assembly\Scripts
```

Simply place your Lua scripts in this directory. You can then load any desired Lua script via the "Lua" tab in the cheats menu.

### Getting Started with Lua Scripting

Whether you're experienced or a beginner, we recommend using Visual Studio Code for script development due to its optimal features for coding. To start creating a Lua script:

1. Navigate to the directory mentioned above.
2. Create a new file with the `.lua` extension.
3. Open it and start coding your script.

For beginners, we highly recommend the [Lua in 5 Minutes guide](https://learnxinyminutes.com/docs/lua/) to quickly get acquainted with Lua scripting basics.
# Colors

To render text with different colors using our Lua API, you can easily incorporate hex color codes. Here's an example:

```lua
cheat.set_callback("paint", function()

render.text(0, 0, "Hello, \a94aad1FFUser", 255, 255, 255, 255, "oc", 2)

end)
```

In this example, the text "User" is rendered in a specified color using the `\a` followed by the hex color code `94aad1FF`. You can replace `94aad1FF` with any hex color code of your choice.

#### Examples of Hex Color Codes:

* Red: `#FF0000FF`
* Green: `#00FF00FF`
* Blue: `#0000FFFF`
* Yellow: `#FFFF00FF`
* Cyan: `#00FFFFFF`
* Magenta: `#FF00FFFF`

Simply swap out the hex code after `\a` to change the text color to your liking.
---
description: 'Functions:'
---

# Globals

## data\_model

```lua
globals.data_model()
```

The `data_model` function returns all objects within the game's hierarchy, encompassing everything in the game environment.

## workspace

```lua
globals.workspace()
```

The `workspace` function returns the current workspace instance within the game.

## place\_id

```lua
globals.place_id()
```

The `place_id` function returns the game's place id.

## is\_focused

```lua
globals.is_focused()
```

The `is_focused` function checks if the Roblox window is currently active. It will return `true` if the window is focused and `false` otherwise. This can be useful for determining whether the player is actively engaging with the game.

## game\_id

```lua
globals.game_id()
```

The `game_id` function returns the game's game id.

## localplayer

```lua
globals.localplayer()
```

The `localplayer` function returns the current local player instance within the game, allowing you to access it directly without needing to manually search for or retrieve the player information.

## latency

```lua
globals.latency()
```

The `latency` function returns the current latency or ping between the client and the server.

## curtime

```lua
globals.curtime()
```

The `curtime` function returns the current app time, indicating the number of seconds since the app started. It is useful for timing events in the game.

{% hint style="warning" %}
Be careful when using `globals.latency()`, as excessive or improper use can significantly impact CPU usage. It's advisable to call this function sparingly and only when necessary to avoid potential performance issues.
{% endhint %}
---
description: 'Functions:'
---

# Menu

## get\_alpha

```lua
ui.get_alpha()
```

The `ui.get_alpha()` function returns the alpha value of the main menu, represented as a floating-point number between 0 and 1. This function is specific to the main menu and does not apply to other interface elements such as the bar, chat, player list, or explorer. The value indicates the transparency level of the main menu, where 0 is fully transparent and 1 is fully opaque.

## get\_position

```lua
ui.get_position()
```

The `ui.get_position()` function returns the x and y coordinates of the main menu position as a table with two numerical values. This function is specific to the main menu and does not apply to other interface elements such as the bar, chat, player list, or explorer.

## get\_size

```lua
ui.get_size()
```

The `ui.get_size()` function returns the x and y dimensions of the main menu. This function is exclusively for obtaining the size of the main menu and does not apply to other interface elements like the bar, chat, player list, or explorer.

## frame\_rate

```lua
ui.frame_rate()
```

The `ui.frame_rate()` function returns the current frame rate of the UI overlay. This value represents how many frames per second (FPS) are being rendered for the overlay, providing a measure of performance and fluidity for UI elements.

## GUI Elements:

## new\_checkbox

```lua
ui.new_checkbox(string: name)
```

## label

```
ui.label(string: name)
```

## new\_combo

```lua
ui.new_combo(string: name, items: any[, ...])

--Example
ui.new_combo("Select Mode", {"Legit","Rage","Semi-Rage"})

-- or you can pass a comma string: "OptionA,OptionB,OptionC"
```

The `items` parameter in the `ui.new_combo` function can accept multiple values in two different formats: a series of comma-separated values or a table of strings. This means you can either list the items directly within the function call separated by commas, or you can provide a table containing strings, each representing an item to be included in the combo box. This flexibility allows you to choose the format that best suits your coding style or the requirements of your application.

## button

```lua
ui.button(string: name)
```

## slider\_float

```lua
ui.slider_float(string: name, float: default, float: min, float: max, string: format)

-- Example

local slidF = ui.slider_float("Smoothness", 1.0, 1.0, 100.0, "%.1f")
```

## slider\_int

```lua
ui.slider_int(string: name, int: default, int: min, int: max, string: format)

-- Example

local slidI = ui.slider_int("Health Bar Spacing", 1, 1, 100, "%d PX")
```

## multi\_select

```lua
ui.multi_select(string: name, items: any[, ...])

--Example
ui.multi_select("Drop Shadow Effect", {"OptionA","OptionB","OptionC"})

-- or you can pass a comma string: "OptionA,OptionB,OptionC"
```

## colorpicker

```lua
ui.colorpicker(string: name, float: r,g,b,a)
```

## keybind

```lua
ui.keybind(string: name)
```

## userinput

```lua
ui.textinput(string: name, string: default value)

-- Example

local tbox = ui.textinput("Skybox Up", "DefaultSkyBoxValue")
```

## guielement:get() / guielement:set\_visible()

```lua
------------------------------------------
-- Checkbox
------------------------------------------
-- Create a checkbox
local myCheckbox = ui.new_checkbox("Enable Feature")

-- Get the current state (returns true/false)
local isEnabled = myCheckbox:get()

-- Use the value in a condition
if isEnabled then
    print("Feature is enabled!")
end

-- Show/hide the checkbox
myCheckbox:set_visible(true) -- Show
myCheckbox:set_visible(false) -- Hide

------------------------------------------
-- Button
------------------------------------------
-- Create a button
local myButton = ui.button("Click Me")

-- Check if the button was pressed this frame
if myButton:get() then
    print("Button was clicked!")
end

-- Show/hide the button
myButton:set_visible(true) -- Show
myButton:set_visible(false) -- Hide

------------------------------------------
-- Combo (Dropdown)
------------------------------------------
-- Create a combo with options
local myCombo = ui.new_combo("Select Option", "Option 1,Option 2,Option 3")
-- Alternative: ui.new_combo("Select Option", {"Option 1", "Option 2", "Option 3"})

-- Get the selected index (returns a number, 0-based)
local selectedIndex = myCombo:get()
print("Selected option index:", selectedIndex)

-- Show/hide the combo
myCombo:set_visible(true) -- Show
myCombo:set_visible(false) -- Hide

------------------------------------------
-- Slider (Float)
------------------------------------------
-- Create a float slider
local mySlider = ui.slider_float("Opacity", 0.5, 0.0, 1.0, "%.2f")

-- Get the current value
local currentValue = mySlider:get()
print("Current slider value:", currentValue)

-- Show/hide the slider
mySlider:set_visible(true) -- Show
mySlider:set_visible(false) -- Hide

------------------------------------------
-- Slider (Int)
------------------------------------------
-- Create an integer slider
local myIntSlider = ui.slider_int("Count", 5, 1, 10, "%d")

-- Get the current value
local count = myIntSlider:get()
print("Current count:", count)

-- Show/hide the slider
myIntSlider:set_visible(true) -- Show
myIntSlider:set_visible(false) -- Hide

------------------------------------------
-- Multi-Select
------------------------------------------
-- Create a multi-select
local myMultiSelect = ui.multi_select("Select Items", {"Item 1", "Item 2", "Item 3"})

-- Get the selected indices as a table
local selectedIndices = myMultiSelect:get()

-- Loop through selected indices
for _, index in ipairs(selectedIndices) do
    print("Selected item at index:", index)
end

-- Show/hide the multi-select
myMultiSelect:set_visible(true) -- Show
myMultiSelect:set_visible(false) -- Hide

------------------------------------------
-- Color Picker
------------------------------------------
-- Create a color picker with default RGBA values
local myColorPicker = ui.colorpicker("Team Color", 1.0, 0.5, 0.2, 1.0)

-- Get the color as a table with r, g, b, a fields
local color = myColorPicker:get()
print("Selected color:", color.r, color.g, color.b, color.a)

-- Use in rendering
render.rect(100, 100, 50, 50,
    math.floor(color.r * 255),
    math.floor(color.g * 255),
    math.floor(color.b * 255),
    math.floor(color.a * 255)
)

-- Show/hide the color picker
myColorPicker:set_visible(true) -- Show
myColorPicker:set_visible(false) -- Hide

------------------------------------------
-- Text Input
------------------------------------------
-- Create a text input with default value
local myTextInput = ui.textinput("Custom Text", "Default value")

-- Get the current text value
local text = myTextInput:get()
print("Current text:", text)

-- Show/hide the text input
myTextInput:set_visible(true) -- Show
myTextInput:set_visible(false) -- Hide

------------------------------------------
-- Keybind
------------------------------------------
-- Create a keybind
local myKeybind = ui.keybind("Aimbot Key")

-- Check if the keybind is currently active
if myKeybind:get() then
    print("Keybind is active!")
end

-- Show/hide the keybind
myKeybind:set_visible(true) -- Show
myKeybind:set_visible(false) -- Hide

------------------------------------------
-- Label (Note: Labels don't have :get() method due to obvious reasons)
------------------------------------------
-- Create a label
local myLabel = ui.label("This is a label")

-- Show/hide the label
myLabel:set_visible(true) -- Show
myLabel:set_visible(false) -- Hide

```


---
description: 'Functions:'
---

# Camera

## GetFov

```lua
camera.GetFov()
```

This function returns the field of view (FOV) value, which is already converted from radians to degrees.

## SetFov

<pre class="language-lua"><code class="lang-lua"><strong>camera.SetFov( value )
</strong></code></pre>

The `SetFov` function adjusts the camera's field of view to the specified value. This value is input in degrees, and the function automatically converts it to radians for internal processing.

## GetPosition

```lua
camera.GetPosition()
```

The `GetPosition` function retrieves the current position of the camera, returning it as a `Vector3`. This allows for precise manipulation and assessment of the camera's location in 3D space.

## SetPosition

```lua
camera.SetPosition( Vector3: x y z )
```

The `SetPosition` function assigns a new position to the camera based on the specified `Vector3` value.

## GetRotation

```lua
camera.GetRotation()
```

The `GetRotation` function retrieves the current orientation of the camera, returning it as a `Matrix3`.&#x20;

## SetRotation

```lua
camera.SetRotation( Matrix3 )
```

The `SetRotation` function adjusts the camera's orientation based on the specified `Matrix3` values.

## GetSubject

<pre class="language-lua"><code class="lang-lua"><strong>camera.GetSubject()
</strong></code></pre>

The `GetSubject` function retrieves the instance that the camera is currently assigned to, allowing you to identify what object or entity the camera is focused on.

## SetSubject

```lua
camera.SetSubject( Instance )
```

The `SetSubject` function allows you to set the camera's focus to a specific instance. By passing the desired instance as a parameter, you can direct the camera's attention to that particular object or entity within the scene.
---
description: 'Functions:'
---

# Game

## Name

```lua
instance:Name()
```

The `instance:Name()` function returns the name of the instance as a string.

## ClassName

```lua
instance:ClassName()
```

The `instance:ClassName()` function returns the class name of the instance as a string.

## FindChild

```lua
instance:FindChild(string: ChildName)
```

The `instance:FindChild()` function searches for a child with the specified name within the instance and returns the instance of that child if found. If no child with the given name exists, it returns `nil`.

## FindChildByClass

```lua
instance:FindChildByClass(string: ChildClass)
```

The `instance:FindChildByClass()` function searches for a child with the specified class name within the instance and returns the instance of that child if found. If no child with the given class name exists, it returns `nil`.

## Children

```lua
instance:Children()
```

The `instance:Children()` function retrieves all the direct children of the instance and returns them as a table. This allows you to access each child individually using the table index or by iterating through the table.

## Parent

```lua
instance:Parent()
```

The `instance:Parent()` function returns the parent instance of the current instance.

## UserID

```lua
instance:UserID()
```

The `instance:UserID()` function returns the user ID of the specified instance. This function is primarily utilized in the context of player instances in a game, providing a unique identifier for each player.

## ModelInstance

```lua
instance:ModelInstance()
```

The `instance:ModelInstance()` function returns the model instance of a specified player in the game. This model instance represents the 3D model associated with the player character within the game environment.

## Team

```lua
instance:Team()
```

The `instance:Team()` function returns the team instance associated with a specified player in the game. This team instance represents the group or team to which the player belongs.

## Health

```lua
instance:Health()
```

The `instance:Health()` function returns the health value of a player or entity within the game. This is primarily used on humanoid characters to manage their health status during gameplay.

## MaxHealth

```lua
instance:MaxHealth()
```

The `instance:MaxHealth()` function returns the maximum health value of a player or entity within the game. This function is mainly utilized for humanoid characters to determine the upper limit of their health during gameplay.

## RigType

```lua
instance:RigType()
```

The `instance:RigType()` function returns the rig type of a humanoid character within the game. This function will return either `0` or `1`, representing the two possible rig types: `0` for an R6 humanoid and `1` for an R15 humanoid.

## Primitive

```lua
instance:Primitive()
```

Usage Example:

```lua
local Position = instance:Primitive():GetPartPosition()
```

The `instance:Primitive()` function returns the primitive instance associated with an object in the game. This is primarily used for parts and mesh parts. The primitive contains essential physics data, including information about position, velocity, collision, and other physical properties that define how the object interacts within the game environment.

## GetPartPosition

```lua
instance:GetPartPosition()
```

The `GetPartPosition` function retrieves the position of the primitive instance associated with a part or mesh part. It returns the position as a `Vector3.`

## GetPartVelocity

```lua
instance:GetPartVelocity()
```

The `GetPartVelocity` function retrieves the velocity of the primitive instance associated with a part or mesh part. It returns the velocity as a `Vector3`.

## SetPartPosition

```lua
instance:SetPartPosition(Vector3: x, y, z)
```

Usage Example:

```lua
instance:SetPartPosition(Vector3(100,200,300))
```

The `SetPartPosition` function sets the position of the primitive instance. It takes a `Vector3` parameter representing the x, y, and z coordinates and moves the part or mesh part to the specified position.

## SetPartVelocity

```lua
instance:SetPartVelocity(Vector3: x, y, z)
```

Usage Example:

```lua
instance:SetPartVelocity(Vector3(100,200,300))
```

The `SetPartVelocity` function sets the velocity of a primitive instance, such as parts and mesh parts. By specifying a `Vector3` parameter with x, y, and z components, it applies the given velocity vector to the part, influencing its movement.

## GuiGetAbsolutePos

```lua
instance:GuiGetAbsolutePos()
```

The `GuiGetAbsolutePos` function returns the absolute x and y position of the GUI element, such as an image label, frame, or text label. This allows you to determine the element's precise location on the screen relative to the upper-left corner of the GUI.

## GuiSetAbsolutePos

```lua
instance:GuiSetAbsolutePos(Vector2: x, y)
```

The `GuiSetAbsolutePos` function sets the absolute x and y position for the specified GUI element, such as an image label, frame, or text label. This function allows you to place the element precisely on the screen by specifying its coordinates relative to the upper-left corner of the GUI, ensuring accurate positioning for your interface design.
---
description: 'Functions:'
---

# Cache System

When working with a large number of entities, the CPU can experience heavy load due to processing intensive operations. To optimize performance, you can leverage the cheat's cache system. This system stores frequently accessed data temporarily, reducing the need to repeatedly fetch or compute information. By using cached data, you can significantly decrease CPU usage, leading to more efficient entity management.

## localplayer

```lua
entity.localplayer() -- Returns a CachedObject
```

The `entity.localplayer()` function returns the cached local player instance, allowing efficient access and manipulation while minimizing CPU load.

## target

```lua
entity.target() -- Returns a CachedObject
```

The `entity.target()` function returns the cached target from the aimbot system. This allows for quick and efficient targeting by accessing previously processed data rather than calculating target information in real-time, thereby reducing CPU usage.

## get\_players

```lua
entity.get_players() -- Returns CachedObjects
```

The `entity.getplayers()` function returns a list of cached player instances. This allows efficient access and manipulation of player data, reducing CPU load by minimizing direct queries or real-time calculations.

## Name

```lua
CachedObject:Name()
```

The `CachedObject:Name()` method returns the object's name as a string.

## Health

```lua
CachedObject:Health()
```

The `CachedObject:Health()` method returns the object's health as a floating-point number.

## MaxHealth

```lua
CachedObject:MaxHealth()
```

The `CachedObject:MaxHealth()` method returns the object's maximum health as a float.

## UserID

```lua
CachedObject:UserID()
```

The `CachedObject:UserID()` method returns the user's ID as an integer, which uniquely identifies the user in the system.

## RigType

```lua
CachedObject:RigType()
```

The `CachedObject:RigType()` method returns the rig type of a cached object as an integer. It returns `0` for an R6 rig and `1` for an R15 rig.

## Tool

```lua
CachedObject:Tool()
```

The `CachedObject:Tool()` method returns the tool instance of a cached object. This function is typically used to retrieve the specific tool associated with the cached object.

## Team

```lua
CachedObject:Team()
```

The `CachedObject:Team()` method returns the team instance of a cached object. This function is typically used to retrieve the specific team associated with the cached object.

## TeamName

```lua
CachedObject:TeamName()
```

The `CachedObject:TeamName()` method returns the name of the team associated with the cached object as a string.

## GetBonePosition

```lua
CachedObject:GetBonePosition(string: BoneName)
```

The `CachedObject:GetBonePosition(string: BoneName)` method returns a `Vector3` or a table containing positional data that can be accessed using the variables `.x`, `.y`, and `.z`.

## GetBoneRotation

```lua
CachedObject:GetBoneRotation(string: BoneName)
```

## GetBoneRotation

```lua
CachedObject:GetBoneRotation(string: BoneName)
```

The `CachedObject:GetBoneRotation(string: BoneName)` method returns a `Matrix3`, representing the rotation matrix associated with the specified bone.

## Avatar

```lua
CachedObject:Avatar()
```

The `Avatar()` method likely returns a texture ID that can be used to render an image, enabling visualization of the avatar associated with the cached object.

## Status

```lua
CachedObject:Status()
```

The `Status()` method returns a string indicating the player's status in the player list, such as "friendly", "enemy", or "none".

## State

```lua
CachedObject:State()
```

The `State()` method returns a string representing the humanoid's state, such as "running", "platform standing", or "air".

## Bbox

```lua
CachedObject:Bbox()
```

Example:

```lua
local PlayerBbox = CachedObject:Bbox()

if PlayerBbox then
print("x:", bbox.x, "y:", bbox.y, "width:", bbox.width, "height:", bbox.height)

end
```

The `CachedObject:Bbox()` function returns the bounding box dimensions of a cached object. This method provides the positional and size attributes, specifically the `x` and `y` coordinates, along with the `width` and `height` of the cached object.

## GetBone

```lua
CachedObject:GetBone(string: BoneName)
```

The `CachedObject:GetBone(string: BoneName)` function returns the bone instance of the specified bone name within a cached object.

{% hint style="info" %}
The list of current bones for R15 and R6 avatars include:

* **R15**:
  * Head
  * UpperTorso
  * LowerTorso
  * LeftUpperLeg
  * LeftFoot
  * RightUpperLeg
  * RightFoot
  * LeftUpperArm
  * LeftHand
  * RightUpperArm
  * RightHand
  * HRP (HumanoidRootPart)
* **R6**:
  * Head
  * UpperTorso or LowerTorso (These parts are considered the same in R6)
  * LeftFoot
  * RightFoot
  * LeftHand
  * RightHand
  * HRP (HumanoidRootPart)

These bones can be accessed using the `CachedObject:GetBone` function by specifying their respective bone names.
{% endhint %}

{% hint style="danger" %}
For some games, certain bones may be missing due to the limitations in avatar configurations or game-specific customizations.
{% endhint %}

---
description: 'Functions:'
---

# Json

## parse

```lua
json.parse(string: jsonString)
```

Example:

```lua
local jsonString = "{\"name\": \"John\", \"age\": 30}"
local parsedTable = json.parse(jsonString)
-- Should Output: John
print(parsedTable.name)
```

The `json.parse` function takes a JSON-formatted string as its input and converts it into a Lua table. This allows you to access JSON data in a structured format within your Lua scripts. For example, in the provided code, a JSON string representing a person with a name and age is parsed into a Lua table, allowing you to easily access the name using `parsedTable.name`.

## stringify

```lua
json.stringify(table: jsonTable)
```

Example:

```lua
local tableData = {name = "John", age = 30}
local jsonString = json.stringify(tableData)
-- Should Output: {"name":"John","age":30}
print(jsonString)
```

The `json.stringify` function takes a Lua table as its input and converts it into a JSON-formatted string. This is useful for encoding Lua table data into JSON format, which might be needed for data interchange between different systems or working with APIs. The resulting JSON string represents the data in a structured and standard way.
---
description: 'Functions & Examples:'
---

# Math

## Using `Vector2` and `Vector3`:

```lua
-- Vector2 Example:
local vec2 = Vector2(10, 20)  -- Creates a Vec2 with x = 10 and y = 20
print(vec2.x, vec2.y)  -- Output: 10  20

-- Modifying the components of the Vector2 object
vec2.x = 30
vec2.y = 40
print(vec2.x, vec2.y)  -- Output: 30  40

-- Vector3 Example:
local vec3 = Vector3(1, 2, 3)  -- Creates a Vec3 with x = 1, y = 2, z = 3
print(vec3.x, vec3.y, vec3.z)  -- Output: 1  2  3

-- Modifying the components of the Vector3 object
vec3.x = 5
vec3.y = 6
vec3.z = 7
print(vec3.x, vec3.y, vec3.z)  -- Output: 5  6  7

-- Creating a Vector3 from a table
local vec3_from_table = Vector3({x = 1, y = 1, z = 1})  -- Creates Vector3 from table with x, y, z keys
print(vec3_from_table.x, vec3_from_table.y, vec3_from_table.z)  -- Output: 1  1  1

```

## Using `Matrix3`:

```lua
-- Example for Matrix3
local mat = Matrix3({
    {1, 2, 3},  -- First row
    {4, 5, 6},  -- Second row
    {7, 8, 9}   -- Third row
})

-- Accessing matrix elements
print(mat.m[1][1], mat.m[1][2], mat.m[1][3])  -- Output: 1  2  3
print(mat.m[2][1], mat.m[2][2], mat.m[2][3])  -- Output: 4  5  6
print(mat.m[3][1], mat.m[3][2], mat.m[3][3])  -- Output: 7  8  9

-- Modifying matrix elements
    mat = Matrix3({
    {10, 2, 3},  -- First row
    {4, 11, 6},  -- Second row
    {7, 8, 12}   -- Third row
})

print(mat.m[1][1], mat.m[2][2], mat.m[3][3])  -- Output: 10  11  12

```

## Using `Vector3` and Index Methods:

```lua
-- Create a Vec3 object
local v3 = Vector3(1, 2, 3)

-- Accessing properties via indexing
print(v3.x)  -- Output: 1
print(v3.y)  -- Output: 2
print(v3.z)  -- Output: 3

-- Modifying properties via newindex
v3.x = 10
v3.y = 20
v3.z = 30
print(v3.x, v3.y, v3.z)  -- Output: 10  20  30

-- Accessing the vector via table-style indexing
local field = "x"
print(v3[field])  -- Output: 10 (since field is "x")

-- Modifying the vector with the newindex method
v3["y"] = 100
print(v3.x, v3.y, v3.z)  -- Output: 10  100  30
```
---
description: 'Functions:'
---

# Http

## get

```lua
http.get(string: url, function: callback)
```

Example:

```lua
http.get("http://example.com", function(body)
    print("Response Body: " .. body)
end)
```

The `http.get` function sends a GET request to the specified URL. Upon receiving a response, it invokes the provided callback function with the response body, allowing you to handle the data as needed.

## post

```lua
http.post(string: url, table: data, string: body, function: callback)
```

Example:

```lua
http.post("http://example.com", {key1 = "value1", key2 = "value2"}, "Some body content", function(body)
    print("Response Body: " .. body)
end)

```

The `http.post` function sends a POST request to the specified URL with the given data and body string. Upon receiving a response, it executes the provided callback function using the response body, enabling further processing of the response.
---
description: 'Functions:'
---

# Render

## screen\_size

```lua
render.screen_size()
```

Example:

```lua
local ScreenSize = render.screen_size()

print("X: "..ScreenSize.x.." Y: "..ScreenSize.y)
```

The `render.screen_size()` function returns the dimensions of the Roblox window in pixels, providing the width (`x`) and height (`y`) as output.

## create\_font

```lua
render.create_font(string: path, float: size, string: flags)
```

The `create_font` function includes a `flags` parameter that allows customization of the font appearance. The available flags are:

* `a`: Creates an anti-aliased font, which smooths the edges for better readability.
* `b`: Applies bold styling to the font, making the text thicker and more pronounced.
* `l`: Produces a brighter font, enhancing the text's visibility on the screen.
* `s`: Adds extra spacing between characters, increasing the readability for certain text.
* `i`: Renders the font in italic style, slanting the characters for emphasis or stylistic preference.

These flags can be combined to achieve the desired font style.

## measure\_text

```lua
render.measure_text(string, int: font_type)
```

Example:

```lua
local TextSize = render.measure_text(string, int: font_type)

print("W: "..TextSize.x.." H: "..TextSize.y)
```

The `measure_text` function returns the width (`w`) and height (`h`) of the specified text string based on the chosen font type. The `font_type` parameter determines the style of the text, with the following options:

* `0`: Default
* `1`: Pixel
* `2`: Normal
* `3`: Bold
* `4`: Normal Anti-aliased

## text

```lua
render.text(int: x, int: y, string: text, int: r, g, b, a, string: flags, int: font_type)
```

The `render.text` function is used to draw text on the screen at specified coordinates (`x`, `y`). It takes several parameters to customize the text rendering, including color values (`r`, `g`, `b`, `a` for red, green, blue, and alpha respectively), and `font_type` for styling the text. One of the key features of this function is the `flags` parameter, which allows you to modify the appearance of the rendered text:

* **`s`**: Adds a shadow to the text.
* **`c`**: Centers the text on the specified coordinates.
* **`o`**: Outlines the text.

These flags can be combined in any order to achieve the desired text styling. For example, using the flags string `cs` will center the text and apply a shadow, regardless of the order in which the flags are specified.

## rect\_outline

```lua
render.rect_outline(x, y, width, height, r, g, b, a, outlineRounding, outlineThickness)
```

The `render.rect_outline` function draws only the rectangle's border. Customize it with `outlineRounding` for corners and `outlineThickness` for the border width.

## rect

```lua
render.rect(x, y, width, height, r, g, b, a, rounding)
```

The `render.rect` function draws a filled rectangle. Customize it with `r`, `g`, `b`, `a` for color and `rounding` for corner smoothness.

## gradient

```lua
render.gradient(x, y, width, height, r1, g1, b1, a1, r2, g2, b2, a2, r3, g3, b3, a3, r4, g4, b4, a4)
```

The `render.gradient` function draws a filled rectangle with a smooth color transition between specified corner colors.

## line

```lua
render.line(x1, y1, x2, y2, r, g, b, a, thickness)
```

The `render.line` function draws a straight line between `(x1, y1)` and `(x2, y2)` with specified color `(r, g, b)`, opacity `a`, and thickness.

## circle\_outline

```lua
render.circle_outline(x, y, radius, r, g, b, a, outlineThickness, segments)
```

The `render.circle_outline` function draws just the perimeter of a circle at `(x, y)` with a `radius`, using color `(r, g, b)`, opacity `a`, and `outlineThickness`, with adjustable `segments` for smoothness.

## circle

```lua
render.circle(x, y, radius, r, g, b, a, segments)
```

The `render.circle` function draws a filled circle at `(x, y)` with a given `radius`, color `(r, g, b)`, and opacity `a`. The `segments` parameter adjusts smoothness.

## triangle\_outline

```lua
render.triangle_outline(x1, y1, x2, y2, x3, y3, r, g, b, a, thickness)
```

The `render.triangle_outline` function draws only the perimeter of a triangle, not a filled shape, with customizable color `(r, g, b)`, opacity `a`, and `thickness`.

## triangle

```lua
render.triangle(x1, y1, x2, y2, x3, y3, r, g, b, a)
```

The `render.triangle` function draws a filled triangle with vertices `(x1, y1)`, `(x2, y2)`, `(x3, y3)`, color `(r, g, b)`, and transparency `a`.

## texture

```lua
render.texture(string: link)
```

The `render.texture` function loads a texture from the specified URL or file path provided as a string in the argument `link`. It returns an integer representing the unique texture ID, which can be used to reference the loaded texture in subsequent rendering operations.

## image

```lua
render.image(textureId, x1, y1, x2, y2, uvX1, uvY1, uvX2, uvY2, r, g, b, a)

-- Can be used:
 render.image(textureId, x1, y1, x2, y2) -- Simple example without UV or tint
```

The `render.image` function is used to render an image onto the screen. It takes a texture ID and the coordinates for the top-left (x1, y1) and bottom-right (x2, y2) corners of the destination rectangle as its primary parameters. Optional parameters for UV coordinates and RGBA tinting values allow for advanced control over which part of the texture is rendered and how it appears.

## shadow

```lua
render.shadow(x, y, w, h, r, g, b, a, thickness, offsetx, offsety, rounding)
```

The `render.shadow` function adds a shadow or glow effect to a rectangle. It uses coordinates for the top-left corner (`x`, `y`), width (`w`), and height (`h`), along with RGBA color values (`r`, `g`, `b`, `a`). The `thickness` adjusts the shadow's thickness, `offsetx` and `offsety` set its offset, and `rounding` provides rounded edges.

## push\_clip\_rect

<pre class="language-lua"><code class="lang-lua"><strong>render.push_clip_rect(x, y, w, h)
</strong></code></pre>

The `render.push_clip_rect` function is used to define a clipping rectangle within which all subsequent rendering operations will be confined. This means that any graphics drawn outside the specified rectangle will not be visible.

## pop\_clip\_rect

```lua
render.pop_clip_rect()
```

The `render.pop_clip_rect` function is used to remove the current clipping rectangle, effectively ending the clipping region that was defined with `render.push_clip_rect`. After this function is called, subsequent rendering operations will no longer be confined to the previous clipping boundaries.

## arc

```lua
render.arc(centerx, centery, radius, a_min, a_max, segments, r, g, b, a, thickness)
```

The `render.arc` function draws an arc on the screen using the following parameters:

* `centerx`, `centery`: Center coordinates.
* `radius`: Arc radius.
* `a_min`, `a_max`: Start and end radians.
* `segments`: Number of segments for smoothness.
* `r`, `g`, `b`, `a`: Color and transparency.
* `thickness`: Line thickness.
---
description: 'Functions:'
---

# Events

## set\_callback

```lua
cheat.set_callback(string: eventname, function)
```

The `cheat.set_callback` function is used to set a callback on a specified event, associating it with a given function. This allows the defined function to execute whenever the specified event occurs.

## List of events:

## paint

```lua
cheat.set_callback("paint", function()
print("Hello world")
end)
```

The `paint` event is triggered every frame and often used for rendering tasks. Callbacks associated with this event will be executed inside the overlay each time the display refreshes, allowing for real-time updates and dynamic visual alterations.

## update\_cache

Fired every 3 seconds. This is used for caching information

## config\_save

Fired when a config gets saved.

## config\_load

Fired when a config gets loaded.

## shutdown

Fired when a script gets unloaded.

## rescan

Fired when a new place is loaded.

{% hint style="info" %}
To note, the list of events available for callbacks is currently limited. However, future updates are expected to expand this functionality with more event types.
{% endhint %}
---
description: 'Functions:'
---

# Utility

## random\_int

```lua
utils.random_int(min: number, max: number)
```

The `utils.random_int` function generates a random integer between the specified `min` and `max` values, inclusive.

## get\_keybinds

```lua
utils.get_keybinds()

-- Example:

local active_keybinds = utils.get_keybinds()
for _, kb in ipairs(active_keybinds) do
print("name: " .. kb.name)
print("type: " .. kb.type) -- toggle / hold
print("state: ".. kb.state) -- true / false
end
```

The `utils.get_keybinds()` function retrieves the current keybindings that are active in the application. It returns a list of keybind objects, where each object contains information about the keybinding, including its name, type (such as toggle or hold), and state (true or false). This allows developers to programmatically access and manage keybindings, facilitating features such as displaying active keybinds or dynamically adjusting key configurations.

## random\_float

```lua
utils.random_float(min: number, max: number)
```

The `utils.random_float` function returns a random floating-point number between the specified `min` and `max` values, inclusive.

{% hint style="info" %}
&#x20;You can find a comprehensive list of virtual key codes on [Microsoft's official documentation site](https://learn.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes).
{% endhint %}

## key\_state

```lua
utils.key_state(int: key)
```

The `utils.key_state` function checks the state of the specified key and returns `true` if the key is currently active or pressed, and `false` otherwise.

## get\_clipboard

```lua
utils.get_clipboard()
```

The `utils.get_clipboard` function retrieves the current contents of the system clipboard and returns it as a string. If the clipboard is empty or contains non-text data, the function may return an empty string or `nil`.

## set\_clipboard

```lua
utils.set_clipboard(string: content)
```

The `utils.set_clipboard` function takes a string parameter `content` and sets the system clipboard to this specified string.

## world\_to\_screen

```lua
utils.world_to_screen(Vector3: Position)
```

The `utils.world_to_screen` function takes a `Vector3` parameter representing a 3D position and converts it into a `Vector2`, which represents the corresponding 2D screen coordinates. This is useful for translating 3D world positions into a format suitable for screen rendering.

## get\_hwid

```lua
utils.get_hwid()
```

The `utils.get_hwid` function returns a unique string that serves as a hardware identifier (HWID) for the PC. This identifier is used to uniquely identify a specific machine and can be useful for applications that require license validation, security features, or user tracking based on hardware.

## get\_tickcount

```lua
utils.get_tickcount()
```

The `utils.get_tickcount` function returns a 64-bit tick count, representing the number of milliseconds that have elapsed since the system was started. This can be useful for measuring elapsed time intervals or scheduling tasks.

## get\_username

```lua
utils.get_username()
```

The `utils.get_username` function returns your assembly username as a string.

## play\_sound

```lua
utils.play_sound(string: link)
```

The `utils.play_sound` function allows you to play a sound from a specified link. The sound file must be in the WAV format to ensure compatibility. To use this function, provide the WAV file's link as a string argument to the `utils.play_sound` function.

## loadstring

```
utils.loadstring(string: code)
```

The `utils.loadstring` function is used to load Lua code from a specified string parameter.&#x20;

## _<mark style="color:red;">Internal</mark>_

## Address

```lua
instance:Address()
```

The `Address` function returns the memory address of the specified instance.

## read\_memory

```lua
utils.read_memory(string: type, address)
```

```lua
-- Example:

local JumpPowerOffset = 0x1a8
local LocalPlayer = globals.localplayer()
local Humanoid = LocalPlayer:ModelInstance():FindChild("Humanoid")

local Value = utils.read_memory("float", Humanoid:Address() + JumpPowerOffset)

print("JumpPower Value: "..Value)
```

The `utils.read_memory` function is designed to read memory data from a specified address, using a given data type. This function is useful in scenarios where you need to access data directly from a memory address in applications, such as game development or system programming.

**Supported Data Types**

The function supports the following data types for memory reading:

* `int`: Reads an integer value.
* `float`: Reads a floating-point value.
* `double`: Reads a double-precision floating-point value.
* `uint64_t`: Reads an unsigned 64-bit integer.
* `uintptr_t`: Reads an unsigned integer type that is capable of holding a pointer.
* `string`: Reads a sequence of characters.
* `Vector3`: Reads a 3-dimensional vector, commonly used in 3D space representation.
* `Vector2`: Reads a 2-dimensional vector, useful for 2D positions and directions.
* `Matrix3`: Reads a 3x3 matrix, typically used for transformations in 3D space.

Use this function to access complex data structures by specifying the appropriate data type and memory address.

## write\_memory

```lua
utils.write_memory(string: type, address, value)
```

```lua
--Example: 

local JumpPowerOffset = 0x1a8
local LocalPlayer = globals.localplayer()
local Humanoid = LocalPlayer:ModelInstance():FindChild("Humanoid")

utils.write_memory("float", Humanoid:Address() + JumpPowerOffset, 100)
```

#### Functionality Overview

The `utils.write_memory` function is designed to write data directly into memory by specifying the data type, target address, and value to be written. This function supports various data types, allowing you to manipulate memory as needed for applications or game modifications. The supported types include:

* `int`: For integer values.
* `float`: For single-precision floating-point values.
* `double`: For double-precision floating-point values.
* `uint64_t`: For unsigned 64-bit integer values.
* `uintptr_t`: For pointer-sized unsigned integer values.
* `string`: For sequences of characters.
* `Vector3`: For 3D vectors, useful in spatial transformations.
* `Vector2`: For 2D positional data.
* `Matrix3`: For operations or transformations involving 3x3 matrices in 3D space.

With this function, developers and modders can adjust game parameters or application settings by directly writing to memory, giving them a high level of control over the software's behavior.



---
description: 'Functions:'
---

# Input

## move

```lua
input.move(int: x, y)
```

The `input.move(int: x, y)` function moves the mouse cursor to the specified coordinates `(x, y)` on the screen.

{% hint style="info" %}
&#x20;You can find a comprehensive list of virtual key codes on [Microsoft's official documentation site](https://learn.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes).
{% endhint %}

## click

```lua
input.click(int: key)
```

The `input.click(int: key)` function performs a click action using the specified virtual key. If no `key` is provided, it defaults to the left mouse button click.

## down

```lua
input.down(int: key)
```

The `input.down(int: key)` function simulates the pressing down of a specified virtual key. If no `key` is provided, it defaults to pressing the left mouse button.

## lift

```lua
input.lift(int: key)
```

The `input.lift(int: key)` function simulates the release of a specified virtual key. If no `key` is provided, it defaults to lifting the left mouse button.

## cursor\_position

```lua
input.cursor_position()
```

The `input.cursor_position()` function returns the current position of the mouse cursor as a `vector2`, representing the x and y coordinates on the screen.
