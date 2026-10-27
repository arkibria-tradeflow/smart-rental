# Smart Rental photo import

To install the 58 optimized vehicle images:

1. Download `smart-rental-car-images-ready.zip` from this chat.
2. Open the GitHub repository and choose **Add file > Upload files**.
3. Upload the **ZIP file itself** to the **root** of the `main` branch (do not extract it).
4. Commit the upload.

The workflow `.github/workflows/import-car-images.yml` then checks each WebP against `fleet-data.js`, replaces matching vehicle images in `assets/`, switches the homepage's category photos and hero to the uploaded fleet photos, and removes the temporary ZIP from the repository.

Check the **Actions** tab for the workflow result. If GitHub Pages does not automatically rebuild following the bot-generated commit, save the Pages configuration or create a new regular commit to trigger publishing.

Expected number of photos: **58**. Still missing: `hyundai-staria.webp` and `land-rover-defender.webp`. The accidental input name `bmercedes-g63.webp` has already been corrected to `mercedes-g63.webp` in the optimized package.

**Rights & accuracy:** Photos are supplied by the customer and may depict representative trim/year combinations. Obtain commercial-use permission and confirm exact rental models before treating images as depictions of particular vehicles.
