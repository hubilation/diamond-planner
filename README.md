# Diamond Planner

A beautiful web application for creating and customizing nested diamond patterns with unlimited color combinations.

![Diamond Planner Preview](diamond-example.png)

## Features

### ✨ Interactive Diamond Designer
- **Adjustable Diamond Count**: Choose between 1-10 nested diamonds
- **Real-time Preview**: See changes instantly as you design
- **Perfect Nesting**: Automatically sized diamonds for optimal visual effect

### 🎨 Advanced Color Controls
- **Professional RGB Color Pickers**: Full-featured color selection similar to Photoshop
- **Multiple Input Methods**: 
  - Visual color picker
  - Manual RGB value inputs (0-255)
  - Hex color codes
- **Real-time Synchronization**: All color inputs stay perfectly synchronized

### 💾 Palette Management
- **Save Palettes**: Store your favorite color combinations
- **Persistent Storage**: Palettes saved using localStorage (survives browser restarts)
- **Visual History**: See mini previews of all saved palettes
- **Quick Loading**: One-click palette restoration
- **Easy Management**: Delete unwanted palettes with a single click
- **Smart Limits**: Automatically manages up to 20 saved palettes

## Getting Started

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd diamond-planner
   ```

2. **Open in browser**
   ```bash
   # Simply open index.html in your web browser
   open index.html
   ```
   
   Or use a local server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js (if you have http-server installed)
   npx http-server
   ```

3. **Start designing!**
   - Adjust the number of diamonds with the slider
   - Click on colors to customize each diamond layer
   - Save your favorite combinations
   - Load previous palettes anytime

## File Structure

```
diamond-planner/
├── index.html          # Main HTML structure
├── style.css           # All styling and responsive design
├── script.js           # Interactive functionality and palette management
├── diamond-example.png # Example diamond pattern
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## Technical Details

- **Pure Vanilla JavaScript**: No frameworks or dependencies
- **Responsive Design**: Works on desktop and mobile devices
- **Modern CSS**: Uses CSS Grid, Flexbox, and modern properties
- **Local Storage**: Persistent palette storage without requiring a backend
- **Cross-browser Compatible**: Works in all modern browsers

## Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for any purpose.

## Development

The application uses vanilla HTML, CSS, and JavaScript, making it easy to modify and extend:

- **Add new color formats**: Extend the color conversion functions
- **New export formats**: Add functionality to export designs
- **Animation effects**: Enhance the visual experience
- **Preset palettes**: Add built-in color schemes

## Inspiration

Based on geometric diamond patterns and inspired by tools like Adobe Photoshop's color picker interface. 
