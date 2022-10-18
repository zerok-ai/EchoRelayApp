echo "🔨  Building"
echo 
docker build ./ -t demoapp
echo
echo "🖼️  Pushing image to minikube, will take time..."
minikube image rm demoapp || echo "Image not present"
minikube image load demoapp
echo "✅  Done"