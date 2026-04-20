# pixelmaxxxing

## Türkçe

`pixelmaxxxing`, bir görseli düzenlenebilir mozaik parçalara dönüştüren Electron tabanlı bir masaüstü uygulamasıdır. Renk seçimi, benzer tonları eşleme, toplu renk değiştirme, piksel öteleme ve SVG dışa aktarma işlemlerini tek ekranda toplar.

### Güncel özellikler

- Görsel yükleme ve anlık önizleme
- Görsel ölçüsünü `en x boy px` olarak gösterme
- Mozaiği `satır / sütun` veya `parça eni / parça boyu` ile ayarlama
- Kare ve yuvarlak mozaik şekli
- Yatay ve dikey parça aralığını ayrı ayrı ayarlama
- Her mozaik parçaya Gauss blur uygulama
- Birbirinden farklı ve canlı renklerden otomatik palet çıkarma
- Önizlemeden mozaik tıklayarak rengi palete elle ekleme
- Tekli seçim, çoklu seçim ve sürükleyerek alan seçimi
- `Shift` ile seçime ekleme
- `Alt` ile seçimden çıkarma
- Tek seçilen veya elle seçilen mozaiklerden benzer tonları `Renk yakınlığı` ile bulma
- Seçim önizlemesini açıp kapatma
- Seçilen mozaikleri yeni bir renge topluca dönüştürme
- `Piksel öteleme` ile seçili mozaikleri sağa, sola, yukarı veya aşağı adım adım kopyalayarak taşıma
- `Ctrl + Z` ile seçim işlemlerini geri alma
- Canvas için transparan, beyaz, siyah veya özel arkaplan rengi seçme
- Seçilen arkaplan rengini SVG export içinde de koruma
- Yakınlaşma, uzaklaşma ve ekrana sığdırma odaklı önizleme
- SVG olarak vektörel çıktı alma
- Windows için paketlenebilir `setup` ve `portable exe` üretme

### Ayrıntılı kullanım kılavuzu

1. `Görsel Seç` alanından bir görsel yükle.
2. Üst barda görselin gerçek boyutunu `px` olarak kontrol et.
3. `Mozaik` bölümünde çalışma şeklini belirle:
   - daha düzenli bölme için `Satır / Sütun`
   - daha fiziksel kontrol için `Parça eni / Parça boyu`
4. Gerekirse `Parça şekli`, `Sağ-sol aralığı`, `Yukarı-aşağı aralığı` ve `Gauss blur` değerlerini değiştir.
5. `Bulunan renkler` alanında otomatik çıkarılan renklerden birini seç veya doğrudan önizlemede bir mozaik parçaya tıkla.
6. `Seçim` bölümündeki `Renk yakınlığı` çubuğunu oynatarak o tona benzeyen diğer mozaikleri dahil et.
7. İstersen `Benzerlerini Seç` ile mevcut seçimden yeni bir benzerlik taraması yap.
8. `Yeni renk` alanından bir renk belirleyip `Seçileni Değiştir` ile toplu renk değişimi uygula.
9. `Piksel öteleme` bölümünde yön ve adım sayısı vererek seçili mozaikleri kopyalayarak sağa, sola, yukarı veya aşağı taşı.
10. Canvas altındaki kare kutulardan arkaplanı seç:
    - transparan
    - beyaz
    - siyah
    - özel renk
11. `+`, `-` ve `Sıfırla` ile önizleme yakınlığını ayarla.
12. `Yenile` ile seçim konturlarını ve geçici önizleme izlerini temizle.
13. `SVG olarak çıktısını al` ile sonucu vektörel olarak dışa aktar.

### Kısayollar

- `Shift + tık / sürükle`: seçime ekler
- `Alt + tık / sürükle`: seçimden çıkarır
- `Ctrl + Z`: seçim geri alır

### Geliştirme

```powershell
npm.cmd install
npm.cmd start
```

### Windows paketleme

```powershell
npm.cmd run dist:win
```

---

## English

`pixelmaxxxing` is an Electron desktop app that turns an image into editable mosaic tiles. It combines color picking, similar-color matching, bulk recoloring, pixel shifting, and SVG export in a single workspace.

### Current features

- Load an image and preview it instantly
- Show the image size as `width x height px`
- Control the mosaic by `rows / columns` or `tile width / tile height`
- Square and round tile shapes
- Separate horizontal and vertical tile spacing
- Gaussian blur per tile
- Automatically extract a varied, vivid color palette
- Add colors manually by clicking tiles on the preview
- Single selection, multi-selection, and drag-area selection
- `Shift` to add to the current selection
- `Alt` to subtract from the selection
- Use `Color similarity` to expand a single or manual selection to matching tones
- Toggle selection preview on or off
- Replace selected tiles with a new color
- Apply `Pixel shift` to copy selected tiles left, right, up, or down by step count
- Undo selection actions with `Ctrl + Z`
- Choose transparent, white, black, or custom canvas background
- Keep the selected background color in SVG export
- Zoom in, zoom out, and fit-focused preview behavior
- Export the result as vector SVG
- Build Windows `setup` and `portable exe` packages

### Detailed usage guide

1. Load an image with `Select Image`.
2. Check the real image dimensions in `px` on the top bar.
3. In the `Mosaic` section, choose how you want to build the grid:
   - use `Rows / Columns` for a structured layout
   - use `Tile width / Tile height` for direct size control
4. Adjust `Tile shape`, horizontal gap, vertical gap, and `Gaussian blur` if needed.
5. Select one of the automatically extracted colors from `Found colors`, or click a tile directly in the preview.
6. Use the `Color similarity` slider to include tiles close to that tone.
7. Use `Select Similar` to refresh or expand the current match set from your current selection.
8. Pick a value in `New color` and use `Replace Selection` to recolor the selected tiles in one step.
9. In `Pixel shift`, choose a direction and step count to copy selected tiles left, right, up, or down.
10. Use the square background swatches below the canvas to switch between:
    - transparent
    - white
    - black
    - custom color
11. Use `+`, `-`, and `Reset` to manage preview zoom.
12. Use `Refresh` to clear temporary selection overlays and preview traces.
13. Use `Export as SVG` to save the result as a vector file.

### Shortcuts

- `Shift + click / drag`: add to selection
- `Alt + click / drag`: subtract from selection
- `Ctrl + Z`: undo selection changes

### Development

```powershell
npm.cmd install
npm.cmd start
```

### Windows packaging

```powershell
npm.cmd run dist:win
```

---

## Français

`pixelmaxxxing` est une application de bureau Electron qui transforme une image en mosaïque modifiable. Elle réunit dans une seule interface la sélection de couleurs, la recherche de tons similaires, le recoloriage en masse, le décalage de pixels et l’export SVG.

### Fonctionnalités actuelles

- Charger une image avec aperçu immédiat
- Afficher la taille de l’image en `largeur x hauteur px`
- Régler la mosaïque par `lignes / colonnes` ou `largeur / hauteur des cellules`
- Formes de cellules carrées et rondes
- Espacement horizontal et vertical séparé
- Flou gaussien appliqué à chaque cellule
- Extraction automatique d’une palette variée et vive
- Ajout manuel de couleurs en cliquant sur les cellules dans l’aperçu
- Sélection simple, multiple et par zone glissée
- `Shift` pour ajouter à la sélection
- `Alt` pour retirer de la sélection
- Utiliser la `proximité de couleur` pour étendre une sélection à des tons proches
- Activer ou désactiver l’aperçu de sélection
- Remplacer toutes les cellules sélectionnées par une nouvelle couleur
- Appliquer un `décalage de pixels` vers la gauche, la droite, le haut ou le bas
- Annuler les actions de sélection avec `Ctrl + Z`
- Choisir un fond transparent, blanc, noir ou personnalisé
- Conserver ce fond dans l’export SVG
- Zoom avant, zoom arrière et aperçu ajusté à l’écran
- Export vectoriel en SVG
- Génération de packages Windows `setup` et `portable exe`

### Guide d’utilisation détaillé

1. Charge l’image avec `Görsel Seç / Select Image`.
2. Vérifie les dimensions réelles de l’image en `px` dans la barre supérieure.
3. Dans la section `Mosaïque`, choisis ton mode de travail :
   - `lignes / colonnes` pour une structure régulière
   - `largeur / hauteur des cellules` pour un contrôle direct
4. Ajuste la forme, les espacements horizontal et vertical, ainsi que le flou gaussien si nécessaire.
5. Sélectionne une couleur dans `Couleurs trouvées` ou clique directement sur une cellule dans l’aperçu.
6. Utilise le curseur de `proximité de couleur` pour inclure les cellules proches du ton choisi.
7. Utilise `Sélectionner les similaires` pour recalculer ou élargir la sélection actuelle.
8. Choisis une `nouvelle couleur`, puis applique le remplacement sur la sélection.
9. Dans `Décalage de pixels`, définis une direction et un nombre de pas pour copier les cellules sélectionnées.
10. Utilise les carrés de fond sous le canvas pour passer entre :
    - transparent
    - blanc
    - noir
    - couleur personnalisée
11. Utilise `+`, `-` et `Reset` pour régler le zoom.
12. Utilise `Refresh` pour nettoyer les contours temporaires et l’aperçu.
13. Utilise `Export as SVG` pour enregistrer le résultat en vecteur.

### Raccourcis

- `Shift + clic / glisser` : ajouter à la sélection
- `Alt + clic / glisser` : retirer de la sélection
- `Ctrl + Z` : annuler la sélection

### Développement

```powershell
npm.cmd install
npm.cmd start
```

### Packaging Windows

```powershell
npm.cmd run dist:win
```

---

## Deutsch

`pixelmaxxxing` ist eine Electron-Desktop-App, die ein Bild in bearbeitbare Mosaik-Kacheln umwandelt. Farbauswahl, Ähnlichkeitssuche, Massen-Umfärbung, Pixel-Verschiebung und SVG-Export laufen in einer einzigen Oberfläche zusammen.

### Aktuelle Funktionen

- Bild laden mit sofortiger Vorschau
- Bildgröße als `Breite x Höhe px` anzeigen
- Mosaik über `Zeilen / Spalten` oder `Kachelbreite / Kachelhöhe` steuern
- Quadratische und runde Kachelformen
- Getrennter horizontaler und vertikaler Abstand
- Gaußscher Weichzeichner pro Kachel
- Automatische Extraktion einer vielfältigen, kräftigen Farbpalette
- Farben manuell hinzufügen, indem Kacheln in der Vorschau angeklickt werden
- Einzel-, Mehrfach- und Bereichsauswahl
- `Shift`, um zur Auswahl hinzuzufügen
- `Alt`, um aus der Auswahl zu entfernen
- Mit `Farbähnlichkeit` ähnliche Töne aus einer Auswahl ermitteln
- Auswahlvorschau ein- und ausschalten
- Ausgewählte Kacheln gesammelt umfärben
- `Pixelverschiebung` nach links, rechts, oben oder unten mit Schrittanzahl
- Auswahlaktionen mit `Ctrl + Z` rückgängig machen
- Transparenter, weißer, schwarzer oder eigener Canvas-Hintergrund
- Gewählten Hintergrund auch im SVG-Export behalten
- Zoomen und an den verfügbaren Bereich angepasste Vorschau
- Export als Vektor-SVG
- Erzeugung von Windows-`Setup`- und `Portable-EXE`-Paketen

### Detaillierte Anleitung

1. Lade ein Bild über `Bild auswählen`.
2. Prüfe in der oberen Leiste die echte Bildgröße in `px`.
3. Wähle im Bereich `Mosaik`, wie das Raster aufgebaut werden soll:
   - `Zeilen / Spalten` für eine feste Struktur
   - `Kachelbreite / Kachelhöhe` für direkte Größenkontrolle
4. Passe Form, horizontalen Abstand, vertikalen Abstand und Gauß-Blur bei Bedarf an.
5. Wähle eine Farbe aus `Gefundene Farben` oder klicke direkt eine Kachel in der Vorschau an.
6. Nutze den Regler `Farbähnlichkeit`, um ähnliche Kacheln zur Auswahl hinzuzunehmen.
7. Mit `Ähnliche auswählen` kannst du die aktuelle Auswahl erweitern oder neu berechnen.
8. Wähle unter `Neue Farbe` einen Zielton und färbe die Auswahl gesammelt um.
9. Im Bereich `Pixelverschiebung` kannst du Richtung und Schrittanzahl festlegen, um ausgewählte Kacheln zu kopieren.
10. Unter dem Canvas kannst du den Hintergrund umschalten:
    - transparent
    - weiß
    - schwarz
    - benutzerdefinierte Farbe
11. Verwende `+`, `-` und `Reset`, um den Zoom zu steuern.
12. Verwende `Refresh`, um temporäre Konturen und Vorschau-Spuren zu entfernen.
13. Exportiere das Ergebnis mit `Export as SVG` als Vektordatei.

### Tastenkürzel

- `Shift + Klick / Ziehen`: zur Auswahl hinzufügen
- `Alt + Klick / Ziehen`: aus Auswahl entfernen
- `Ctrl + Z`: Auswahl rückgängig machen

### Entwicklung

```powershell
npm.cmd install
npm.cmd start
```

### Windows-Paketierung

```powershell
npm.cmd run dist:win
```

---

## Русский

`pixelmaxxxing` — это настольное приложение на Electron, которое превращает изображение в редактируемую мозаику. В одном интерфейсе собраны выбор цветов, поиск похожих оттенков, массовая перекраска, смещение пикселей и экспорт в SVG.

### Актуальные возможности

- Загрузка изображения с мгновенным предпросмотром
- Отображение размера изображения как `ширина x высота px`
- Управление мозаикой через `строки / столбцы` или `ширину / высоту плитки`
- Квадратная и круглая форма плиток
- Отдельная настройка горизонтальных и вертикальных промежутков
- Размытие по Гауссу для каждой плитки
- Автоматическое извлечение разнообразной и яркой палитры
- Ручное добавление цветов кликом по плиткам в предпросмотре
- Одиночное выделение, множественное выделение и выделение областью
- `Shift` для добавления к выделению
- `Alt` для исключения из выделения
- Использование `цветовой близости` для поиска похожих оттенков
- Включение и выключение предпросмотра выделения
- Замена выделенных плиток новым цветом
- `Смещение пикселей` влево, вправо, вверх или вниз на заданное число шагов
- Отмена действий выделения через `Ctrl + Z`
- Прозрачный, белый, черный или пользовательский фон холста
- Сохранение выбранного фона в SVG-экспорте
- Масштабирование и удобный предпросмотр в пределах экрана
- Векторный экспорт в SVG
- Сборка Windows-пакетов `setup` и `portable exe`

### Подробное руководство

1. Загрузите изображение через `Select Image`.
2. Проверьте реальные размеры изображения в `px` в верхней панели.
3. В разделе `Mosaic` выберите способ построения сетки:
   - `строки / столбцы` для строгой структуры
   - `ширина / высота плитки` для прямого контроля размера
4. При необходимости настройте форму, горизонтальные и вертикальные промежутки, а также Gaussian blur.
5. Выберите цвет из блока найденных цветов или кликните по плитке прямо в предпросмотре.
6. Используйте ползунок `цветовой близости`, чтобы добавить похожие плитки.
7. Кнопка `Select Similar` позволяет пересчитать или расширить текущее выделение.
8. Выберите `новый цвет` и примените массовую замену для выделения.
9. В блоке `Pixel shift` задайте направление и количество шагов, чтобы копировать выделенные плитки.
10. Ниже canvas можно выбрать фон:
    - прозрачный
    - белый
    - черный
    - пользовательский цвет
11. Используйте `+`, `-` и `Reset` для управления масштабом.
12. Используйте `Refresh`, чтобы очистить временные контуры и следы предпросмотра.
13. Используйте `Export as SVG`, чтобы сохранить результат как векторный файл.

### Горячие клавиши

- `Shift + клик / перетаскивание`: добавить к выделению
- `Alt + клик / перетаскивание`: убрать из выделения
- `Ctrl + Z`: отменить изменение выделения

### Разработка

```powershell
npm.cmd install
npm.cmd start
```

### Сборка для Windows

```powershell
npm.cmd run dist:win
```
