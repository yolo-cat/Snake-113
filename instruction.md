### 貪食蛇遊戲規格書

**1. 資料結構**

*   **蛇 (`snake`)**: 一個陣列，每個元素是一個物件 `{x, y}`，代表蛇身體的每一節座標。陣列的第一個元素 (`snake[0]`) 代表蛇頭。
*   **食物 (`food`)**: 一個物件 `{x, y}`，代表食物在地圖上的座標。
*   **目前方向 (`direction`)**: 一個物件 `{x, y}`，代表蛇當前移動的方向向量（例如 `{x: 1, y: 0}` 代表向右）。
*   **下一個方向 (`nextDirection`)**: 一個物件 `{x, y}`，儲存使用者透過鍵盤輸入的下一個方向。這會在下一個遊戲迴圈開始時更新 `direction`，以防止蛇立即反向移動。
*   **分數 (`score`)**: 一個數字，記錄玩家目前的分數。
*   **速度 (`speed`)**: 一個數字，代表遊戲迴圈的間隔時間（毫秒）。分數越高，速度越快（間隔時間越短）。
*   **遊戲迴圈計時器 (`gameInterval`)**: 儲存 `setInterval` 回傳的 ID，用於控制遊戲主迴圈。
*   **遊戲運行狀態 (`isRunning`)**: 一個布林值，表示遊戲是否正在進行中（尚未結束）。
*   **地圖格大小 (`GRID_SIZE`)**: 一個常數，定義地圖的寬度和高度（格數）。

**2. 地圖繪製與響應式設計 (RWD)**

*   使用 HTML 的 `div#gameBoard` 元素作為遊戲畫布。
*   **響應式佈局**:
    *   CSS (`style.css`) 負責使遊戲畫布具備響應式設計 (RWD) 能力。
    *   `#gameBoard` 的寬度和高度使用相對單位 (如 `vmin`, `vw`, `%`) 或設定 `max-width`/`max-height`，取代固定的像素值，使其能根據視窗或父容器大小自動調整。
    *   可使用 `aspect-ratio: 1 / 1;` 或將寬高設為相同的 viewport 單位 (如 `90vmin`) 來維持畫布的正方形比例。
*   **網格劃分**:
    *   CSS 使用 `display: grid` 將 `#gameBoard` 劃分成 `GRID_SIZE` x `GRID_SIZE` 的網格。
    *   `grid-template-columns` 和 `grid-template-rows` 屬性使用 `repeat()` 函數和 CSS 變數 (`var(--grid-size, 20)`) 來定義網格佈局，其中 `GRID_SIZE` 的值由 JavaScript 在初始化時設定 (`gameBoard.style.setProperty('--grid-size', GRID_SIZE);`)。
*   **格子生成**:
    *   JavaScript 的 `initBoard` 函數動態生成 `GRID_SIZE * GRID_SIZE` 個帶有 `cell` 類別以及 `data-x` 和 `data-y` 屬性的 `div` 元素，並將它們添加到 `#gameBoard` 中。同時，此函數會設定 CSS 變數 `--grid-size`。
*   **畫面更新 (`draw` 函數)**:
    *   `clearBoard` 函數移除所有格子上的 `snake` 和 `food` 類別。
    *   `drawFood` 函數根據 `food` 物件的座標，找到對應的格子元素並添加 `food` 類別。
    *   `drawSnake` 函數遍歷 `snake` 陣列，為每個身體節段對應的格子元素添加 `snake` 類別。
    *   `getCell(x, y)` 輔助函數使用 `document.querySelector` 根據 `data-x` 和 `data-y` 屬性選取特定的格子元素。

**3. 貪食蛇移動**

*   `handleKey` 函數監聽鍵盤的 `keydown` 事件。
*   當按下方向鍵（上、下、左、右）時，該函數會將按鍵對應到一個方向向量 `{x, y}`。
*   如果新方向不是目前方向的反方向，則更新 `nextDirection`。
*   `gameLoop` 函數會定期執行 `update` 函數。
*   `update` 函數首先調用 `moveSnake` 函數：
    *   `moveSnake` 將 `direction` 更新為 `nextDirection`。
    *   計算蛇頭的新座標（目前蛇頭座標 + `direction` 向量）。
    *   使用 `wrapPosition` 函數處理邊界情況，讓蛇可以從一邊穿到另一邊。
*   `update` 函數將計算出的新蛇頭座標添加到 `snake` 陣列的開頭 (`unshift`)。
*   除非吃到食物，否則移除 `snake` 陣列的最後一個元素 (`pop`)，以模擬移動效果。

**4. 產生食物**

*   `randomFood` 函數負責生成食物。
*   它會產生介於 0 到 `GRID_SIZE - 1` 之間的隨機 `x` 和 `y` 座標。
*   確保食物生成在遊戲地圖範圍內。
*   遊戲開始時 (`startGame`) 會調用一次 `randomFood`。
*   當蛇吃到食物時 (`handleFood` 函數)，會再次調用 `randomFood` 來生成新的食物。

**5. 貪食蛇吃食物變長**

*   `update` 函數會調用 `handleFood` 函數，並傳入新蛇頭的座標。
*   `handleFood` 函數檢查新蛇頭的座標是否與 `food` 的座標相同。
*   如果相同：
    *   增加 `score`。
    *   更新畫面上的分數顯示。
    *   調用 `randomFood` 生成新食物。
    *   增加遊戲速度 (`speed` 變數減小)。
    *   重新設定 `gameInterval` 以應用新速度。
    *   `handleFood` 返回 `true`。
*   在 `update` 函數中，如果 `handleFood` 返回 `true`，則跳過 `snake.pop()` 的操作，這樣蛇的身體陣列就增加了一個元素，實現了變長效果。

**6. 貪食蛇吃到自己或碰到邊界會死**

*   `update` 函數在移動蛇 (`moveSnake`) 之後，會檢查以下條件：
    *   **撞到自己**: 調用 `isCollision(snake[0])` 函數，檢查新蛇頭的座標 (`snake[0]`) 是否存在於 `snake` 陣列的其他身體節段中（從索引 1 開始檢查）。
    *   **碰到邊界**: 檢查新蛇頭的座標 (`snake[0]`) 是否超出了地圖邊界（x 或 y 小於 0 或 大於等於 `GRID_SIZE`）。 *（注意：目前的程式碼 `wrapPosition` 函數會讓蛇穿牆，若要實現此規格，需修改程式碼）*
*   如果以上任一條件為 `true`：
    *   調用 `endGame` 函數。
    *   `endGame` 函數會清除 `gameInterval`，停止遊戲迴圈。
    *   設置 `isRunning` 為 `false`。
    *   彈出 "Game Over" 提示框。

**7. 重新開始按鈕**

*   HTML 中有一個 `<button id="startBtn">Start</button>`。
*   JavaScript 為此按鈕添加了點擊事件監聽器，觸發 `startGame` 函數。
*   `startGame` 函數：
    *   清除可能存在的舊 `gameInterval`。
    *   調用 `initBoard` 重新繪製空的棋盤。
    *   重設所有遊戲狀態變數（`snake` 的初始位置和長度為 **3 格**、`direction`、`nextDirection`、`food` 的初始位置、`score` 為 0、`speed` 為初始值、`isRunning` 為 `true`）。
    *   更新分數顯示。
    *   啟動新的 `gameInterval`，開始遊戲迴圈。

**8. 暫停遊戲**

*   HTML 中有一個 `<button id="pauseBtn">Pause</button>`。
*   JavaScript 為此按鈕添加了點擊事件監聽器，觸發 `togglePause` 函數。
*   `togglePause` 函數：
    *   首先檢查 `isRunning` 是否為 `true`（遊戲進行中才能暫停）。
    *   如果 `gameInterval` 存在（表示遊戲正在運行），則調用 `clearInterval(gameInterval)` 停止遊戲迴圈，並將 `gameInterval` 設為 `null`。
    *   如果 `gameInterval` 為 `null`（表示遊戲已暫停），則調用 `setInterval(gameLoop, speed)` 重新啟動遊戲迴圈，並將返回的 ID 賦值給 `gameInterval`。