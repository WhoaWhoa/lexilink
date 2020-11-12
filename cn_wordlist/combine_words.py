

if __name__ == '__main__':
    cn_path = './wordlistcn.txt'
    en_path = './wordlisten.txt'
    out_path = './wordlist.txt'

    with open(cn_path, 'r') as cn_file:
        cn_lines = cn_file.readlines()
    with open(en_path, 'r') as en_file:
        en_lines = en_file.readlines()
    en_lines = [line.replace('\n', ' ') for line in en_lines]

    new_wordlist = []
    for (en_word, cn_word) in zip(en_lines, cn_lines):
        new_wordlist.append(en_word + cn_word)
    with open(out_path, 'w') as out_file:
        for word in new_wordlist:
            out_file.write(word)