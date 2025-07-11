import cv2


img1 = cv2.imread("C:\\Users\\ppeck\\Downloads\\Projects\\peck-footprint\\footprint-be\\data\\RX1000 images\\jpegs\\will 2.jpeg", cv2.IMREAD_GRAYSCALE)
img2 = cv2.imread("C:\\Users\\ppeck\\Downloads\\Projects\\peck-footprint\\footprint-be\\data\\RX1000 images\\jpegs\\will 1.jpeg", cv2.IMREAD_GRAYSCALE)


orb = cv2.ORB_create(nfeatures=1000)  

kp1, des1 = orb.detectAndCompute(img1, None)
kp2, des2 = orb.detectAndCompute(img2, None)

bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
matches = bf.match(des1, des2)

# Step 5: Sort matches by distance (lower distance = better match)
matches = sorted(matches, key=lambda x: x.distance)

# Optional: Show top matches
matched_img = cv2.drawMatches(img1, kp1, img2, kp2, matches[:30], None, flags=2)
cv2.imshow("Matches", matched_img)
cv2.waitKey(0)
cv2.destroyAllWindows()

similarity_score = len(matches)
print("Similarity score (number of matches):", similarity_score)
