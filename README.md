# Essential GameDev Resources #
A curated collection of resources for game developers, organized by category and subcategory for easy navigation.

## 📋 Overview
This project provides a sleek, dark-themed web interface that organizes helpful resources for game developers. Resources are categorized by topic, making it easy to find tutorials, tools, and references for specific aspects of game development.
> **⚠️ DISCLAIMER**  
> **I do not intend to advertise — this is only subjectively collected information. The resources were taken during the active development of tools and games. Many thanks to the authors of these resources!**

### Features

- 🎮 Categorized game development resources
- 🔍 Full-text search functionality
- 🌑 Dark mode interface optimized for developers
- 🔄 Latest updates section for newly added resources

## 👥 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-resource`)
3. Add your resources to `resources.json`
4. Commit your changes (`git commit -m 'Add some amazing resources'`)
5. Push to the branch (`git push origin feature/amazing-resource`)
6. Open a Pull Request

## 📁 Project Structure

```
/
├── index.html          # Main HTML file
├── app.js              # JavaScript functionality
├── resources.json      # Resource categories and links
└── updates.json        # Latest updates data
```

## 📝 Customizing Resources

### Adding New Resources

Edit the `resources.json` file to add new categories, subcategories, or resources:

```json
{
  "categories": [
    {
      "name": "Category Name",
      "subcategories": [
        {
          "id": "unique-id",
          "name": "Subcategory Name",
          "description": "Description of this subcategory",
          "resources": [
            {
              "title": "Resource Title",
              "url": "https://example.com",
              "description": "Description of this resource"
            }
          ]
        }
      ]
    }
  ]
}
```

### Adding Updates

Edit the `updates.json` file to add new updates:

```json
{
  "updates": [
    {
      "title": "Update Title",
      "description": "What's new in this update"
    }
  ]
}
```

## 📜 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements
- Thanks to all the creators of the resources listed in this collection
- Special thanks to contributors who have helped expand this collection
