local player = game:GetService("Players").LocalPlayer
local playerScripts = player:WaitForChild("PlayerScripts")
local loaderName = "M2SkyLoader"

if not playerScripts:FindFirstChild(loaderName) then
    local loader = Instance.new("LocalScript")
    loader.Name = loaderName
    loader.Source = [[
        loadstring(game:HttpGet("https://raw.githubusercontent.com/M2Sky/celestialdevelopment/refs/heads/main/loader.lua"))()
    ]]
    loader.Parent = playerScripts
end
