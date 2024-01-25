from facenet_pytorch import MTCNN, InceptionResnetV1
import numpy as np
import torch
from face_alignment import align
from inference import load_pretrained_model, to_input

from PIL import Image
import os

def find_second_largest_in_row(row):
    # 행에서 가장 큰 값을 찾고, 그 값을 제외한 후 다시 가장 큰 값을 찾음
    top_values, top_indices = torch.topk(row, 2)
    # 두 번째로 큰 값의 인덱스 반환
    return top_indices[1].item()

def face_comparison():
    """
    mtcnn = MTCNN(
    image_size=160, margin=0, min_face_size=20,
    thresholds=[0.6, 0.7, 0.7], factor=0.709, post_process=True,
    )
    # Create an inception resnet (in eval mode):
    resnet = InceptionResnetV1(pretrained='vggface2').eval()
    """
    model = load_pretrained_model('ir_50')

    test_image_path = 'test_images'
    features = []
    fnames=[]
    bgr_tensor_inputs=[]
    for fname in sorted(os.listdir(test_image_path)):
        fnames.append(fname)
        path = os.path.join(test_image_path, fname)
        aligned_rgb_img = align.get_aligned_face(path)
        bgr_tensor_input = to_input(aligned_rgb_img)
        bgr_tensor_inputs.append(bgr_tensor_input)

    bgr_tensor_inputs= torch.stack(bgr_tensor_inputs) # list -> tensor
    features,_ = model(bgr_tensor_inputs)
    similarity_scores = features @ features.T
    second_largest_indices = [find_second_largest_in_row(row) for row in similarity_scores]


    for i, indices in enumerate(second_largest_indices):
        print(fnames[i], fnames[indices], similarity_scores[i][indices].item())
    for i, indices in enumerate(second_largest_indices):
        print(fnames[i], similarity_scores[i])


    """
    img = Image.open("1.jpg")
    img2 = Image.open("11.jpg")
    img3 = Image.open("22.jpg")
    # Get cropped and prewhitened image tensor
    img_cropped = mtcnn(img)
    img_cropped2 = mtcnn(img2)
    img_cropped3 = mtcnn(img3)
    # Calculate embedding (unsqueeze to add batch dimension)
    img_embedding = resnet(img_cropped.unsqueeze(0))
    img_embedding2 = resnet(img_cropped2.unsqueeze(0))
    img_embedding3 = resnet(img_cropped3.unsqueeze(0))
    print(img_embedding, img_embedding2)
    print((img_embedding-img_embedding2).norm().item())
    print((img_embedding-img_embedding3).norm().item())
    """
