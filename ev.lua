local CoreGui = game:GetService("CoreGui")
local oldGui = CoreGui:FindFirstChild("ExecutionTimerGui")
if oldGui then oldGui:Destroy() end
local screenGui = Instance.new("ScreenGui")
screenGui.Name = "ExecutionTimerGui"
screenGui.ResetOnSpawn = false
screenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
screenGui.Parent = CoreGui
local textLabel = Instance.new("TextLabel")
textLabel.Name = "TimerLabel"
textLabel.Parent = screenGui
textLabel.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
textLabel.BorderSizePixel = 0
textLabel.Position = UDim2.new(0.65, 0, 0.47, 0)
textLabel.Size = UDim2.new(0, 240, 0, 55)
textLabel.Font = Enum.Font.SourceSansBold
textLabel.TextColor3 = Color3.new(0, 0, 0)
textLabel.Text = "Gay"
textLabel.TextScaled = true
textLabel.TextWrapped = true
textLabel.TextXAlignment = Enum.TextXAlignment.Center
textLabel.TextYAlignment = Enum.TextYAlignment.Center

local seconds = 0

task.spawn(function()
	while true do
		task.wait(1)
		seconds += 1

		local hrs = math.floor(seconds / 3600)
		local mins = math.floor((seconds % 3600) / 60)
		local secs = seconds % 60

		local displayText = string.format(
			"Since execution: %d hour%s, %d minute%s, %d second%s",
			hrs, hrs == 1 and "" or "s",
			mins, mins == 1 and "" or "s",
			secs, secs == 1 and "" or "s"
		)

		textLabel.Text = displayText
	end
end)


local player = game.Players.LocalPlayer
local character = player.Character or player.CharacterAdded:Wait()
local humanoidRootPart = character:WaitForChild("HumanoidRootPart")
local ticketGroup = workspace.Game.Effects.Tickets
local fallbackPosition = Vector3.new(3292, 10000, 4254)
local fallbackPosition1 = Vector3.new(2000, 20000, 1000)
local fallbackPosition2 = Vector3.new(-2000, 10000, -3000)
local tweenService = game:GetService("TweenService")
local runService = game:GetService("RunService")
local httpService = game:GetService("HttpService")
local teleportService = game:GetService("TeleportService")
local textChatService = game:GetService("TextChatService")
local virtualUser = game:GetService("VirtualUser")

local function firePlayerMode()
    local args = { [1] = true }
    game:GetService("ReplicatedStorage"):WaitForChild("Events"):WaitForChild("Player"):WaitForChild("ChangePlayerMode"):FireServer(unpack(args))
end

firePlayerMode()

local function setupCharacter(character)
    local humanoid = character:WaitForChild("Humanoid")

    local connection
    connection = runService.Heartbeat:Connect(function()
        if humanoid.Health <= 0 then
            firePlayerMode()
            connection:Disconnect()
        end
    end)
end

if player.Character then
    setupCharacter(player.Character)
end

player.CharacterAdded:Connect(function(character)
    setupCharacter(character)
end)

local function teleportTo(position)
    local tweenInfo = TweenInfo.new(0.2, Enum.EasingStyle.Linear, Enum.EasingDirection.Out)
    local goal = { Position = position }
    local tween = tweenService:Create(humanoidRootPart, tweenInfo, goal)
    tween:Play()
    tween.Completed:Wait()
end

local function refreshCharacter()
    character = player.Character or player.CharacterAdded:Wait()
    humanoidRootPart = character:WaitForChild("HumanoidRootPart")
end

player.CharacterAdded:Connect(refreshCharacter)

local function getAllHitboxes()
    local hitboxes = {}
    for _, group in ipairs(workspace.Game.Players:GetChildren()) do
        if group:IsA("Model") and group:FindFirstChild("Hitbox") then
            table.insert(hitboxes, group.Hitbox.Position)
        end
    end
    return hitboxes
end

local function getSafestTicket()
    local hitboxes = getAllHitboxes()
    local maxDistance = -math.huge
    local safestTicket = nil

    for _, ticket in ipairs(ticketGroup:GetChildren()) do
        if ticket:IsA("Model") and ticket:FindFirstChildWhichIsA("BasePart") then
            local ticketPosition = ticket:FindFirstChildWhichIsA("BasePart").Position
            local minDistanceToHitbox = math.huge

            for _, hitboxPos in ipairs(hitboxes) do
                local distance = (ticketPosition - hitboxPos).Magnitude

                if distance < 5 then
                    teleportTo(fallbackPosition)
                    return nil
                end

                if distance < minDistanceToHitbox then
                    minDistanceToHitbox = distance
                end
            end

            if minDistanceToHitbox > maxDistance then
                maxDistance = minDistanceToHitbox
                safestTicket = ticketPosition
            end
        end
    end

    return safestTicket
end

local apiEndpoint = "https://games.roblox.com/v1/games/"
local placeId = game.PlaceId
local serversUrl = apiEndpoint .. placeId .. "/servers/Public?sortOrder=Asc&limit=10"

local function listServers(cursor)
    local rawData = game:HttpGet(serversUrl .. ((cursor and "&cursor=" .. cursor) or ""))
    return httpService:JSONDecode(rawData)
end

local function serverhop()
    local servers = listServers()
    local server = servers.data[math.random(1, #servers.data)]
    teleportService:TeleportToPlaceInstance(placeId, server.id, player)
end

-- 🟡 AUTO-SERVERHOP ON KEYWORD DETECTION
local blacklist = { "cheater", "hacker", "m_2sky", "m_2", "sky", "record" }

local lastKeywordTrigger = 0
local keywordCooldown = 5

textChatService.MessageReceived:Connect(function(message)
    local now = tick()
    if now - lastKeywordTrigger < keywordCooldown then return end

    local text = string.lower(message.Text)
    for _, word in ipairs(blacklist) do
        if string.find(text, word) then
            lastKeywordTrigger = now
            print("Keyword detected: " .. word .. " — hopping in 2 seconds...")
            task.delay(2, function()
                serverhop()
            end)
            break
        end
    end
end)

-- 🟢 AUTO TELEPORT LOOP
local timeToWait = 3000
local lastServerHop = os.time()

task.spawn(function()
    while true do
        local safestTicket = getSafestTicket()

        if safestTicket then
            teleportTo(safestTicket)
            task.wait(0.04)
        else
            teleportTo(fallbackPosition)
            task.wait(math.random() * 6.6 + 0.4)
            teleportTo(fallbackPosition1)
            task.wait(math.random() * 7 + 1)
            teleportTo(fallbackPosition2)
        end

        if os.time() - lastServerHop >= timeToWait then
            serverhop()
            lastServerHop = os.time()
        end

        task.wait(0.2)
    end
end)

-- 🟢 ANTI-IDLE
player.Idled:Connect(function()
    virtualUser:CaptureController()
    virtualUser:ClickButton2(Vector2.new())
end)
