-- This policy allows any authenticated user to upload files to the 'images' bucket.
-- You might want to lock this down further in a production environment.
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'images' );

-- This policy allows anyone to view the images in the bucket.
-- This is necessary for the images to be displayed in your app.
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'images' );
