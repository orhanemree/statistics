import math


def frequency(scores: list[float] | list[str]):

    # create frequency table
    table = [(s, scores.count(s)) for s in set(scores)]
    # sort table by scores
    table = sorted(table, key=lambda i: i[0])
    return table


# central tendency

def mean(scores: list[float]):
    
    if len(scores) == 0: return None
    return round(sum(scores)/len(scores), 2)


def median(scores: list[float]):

    l = len(scores)
    if l == 0: return None
    sorted_ = sorted(scores)

    if l%2 == 0:
        # even number of scores
        # return the mean of two middle scores
        return (sorted_[l//2-1]+sorted_[(l+2)//2-1])/2
    else:
        # odd number of scores
        # return the middle score
        return sorted_[(l+1)//2-1]

    
def mode(scores: list[float] | list[str]):
    
    if len(scores) == 0: return None

    # get frequency table
    table = frequency(scores)
    # sort table by frequency
    table = sorted(table, key=lambda i: i[1])

    if len(table) == 1: return table[-1]
    # check if the mode doesn't exist
    if table[-1][1] == table[-2][1]: return None
    # return mode
    return table[-1]


# variability

def varince(scores: list[float]):

    if len(scores) < 2: return 0

    # find mean
    m = mean(scores)
    # sum of squared deviation scores
    ss = 0

    for s in scores:
        deviation = m-s
        ss += deviation**2

    v = round(ss/(len(scores)-1), 2)
    # NOTE: using n-1 division
    return v


def standard_deviation(scores: list[float]):

    # calculate variance
    v = varince(scores)
    return round(math.sqrt(v), 2)
