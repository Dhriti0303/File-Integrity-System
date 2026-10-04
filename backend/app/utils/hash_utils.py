import hashlib

def generate_hash(path):
    sha256=hashlib.sha256()
    with open(path,"rb") as hashF:
        while chunk :=hashF.read(4096):
            sha256.update(chunk)
            msg=sha256.hexdigest()
    return msg

